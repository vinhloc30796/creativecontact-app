// File: hooks/useAuth.ts

import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { createClient } from '@/utils/supabase/client';
import { checkUserIsAnonymous } from '@/app/actions/user/auth';

const supabase = createClient();


interface AuthState {
    user: User | null;
    isLoggedIn: boolean;
    isLoading: boolean;
    error: string | null;
    isAnonymous: boolean;
  }
  
  export function useAuth(): AuthState {
    const [authState, setAuthState] = useState<AuthState>({
      user: null,
      isLoggedIn: false,
      isLoading: true,
      error: null,
      isAnonymous: true,
    });
  
    useEffect(() => {
      let isMounted = true;
      let authListener: { data: { subscription: { unsubscribe: () => void } } } | null = null;
  
      const initializeAuth = async () => {
        try {
          // Check for existing session
          const { data: { user } } = await supabase.auth.getUser();
          
          if (user) {
            const isAnonymous = user.email ? await checkUserIsAnonymous(user.email) || true : true;
            updateAuthState(user, isAnonymous);
          } else {
            // If no session, attempt anonymous sign-in
            const { data, error } = await supabase.auth.signInAnonymously();
            if (error) throw error;
            if (data.user) updateAuthState(data.user, true); // User has signed in anonymously
          }
        } catch (error) {
          console.error('Auth initialization error:', error);
          if (isMounted) {
            setAuthState(prev => ({ ...prev, error: 'Authentication failed', isLoading: false }));
          }
        }
      };
  
      const updateAuthState = (user: User | null, isAnonymous: boolean) => {
        if (isMounted) {
          setAuthState({
            user,
            isLoggedIn: user ? true : false,
            isLoading: false,
            error: null,
            isAnonymous: isAnonymous,
          });
        }
      };
  
      initializeAuth();
  
      // Set up auth state listener
      authListener = supabase.auth.onAuthStateChange((event, session) => {
        // if session, user, is not defined then user is anonymous
        // otherwise, anonymous if user.is_anonymous is true
        // everything else is not anonymous
        const isAnonymous = !session?.user || session?.user?.is_anonymous || false;
        console.log(`Auth state change: ${event} where email is ${session?.user?.email} and ID is ${session?.user?.id} and anonymous: ${isAnonymous}`);
        updateAuthState(session?.user ?? null, isAnonymous); // TODO: Check if user is anonymous
      });
  
      return () => {
        isMounted = false;
        if (authListener?.data.subscription?.unsubscribe) {
          authListener.data.subscription.unsubscribe();
        }
      };      
    }, []);
  
    return authState;
  }
  