// File: hooks/useAuth.ts

import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { createClient } from '@/utils/supabase/client';

const supabase = createClient();


interface AuthState {
    user: User | null;
    isLoading: boolean;
    error: string | null;
    isAnonymous: boolean;
  }
  
  export function useAuth(): AuthState {
    const [authState, setAuthState] = useState<AuthState>({
      user: null,
      isLoading: true,
      error: null,
      isAnonymous: true,
    });
  
    useEffect(() => {
      let isMounted = true;
      let authListener: { subscription: { unsubscribe: () => void } } | null = null;
  
      const initializeAuth = async () => {
        try {
          // Check for existing session
          const { data: { session } } = await supabase.auth.getSession();
          
          if (session?.user) {
            const isAnonymous = session.user.is_anonymous || true;
            updateAuthState(session.user, isAnonymous);
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
        if (authListener?.subscription?.unsubscribe) {
          authListener.subscription.unsubscribe();
        }
      };      
    }, []);
  
    return authState;
  }
  