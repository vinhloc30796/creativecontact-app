"use client"

import React, { useRef, useState, useEffect } from 'react';

interface PasswordStrength {
  hasMinLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  passwordsMatch: boolean;
}

const minCharacters = 6;

const PasswordChecklist: React.FC<{ passwordStrength: PasswordStrength }> = ({ passwordStrength }) => (
  <div className="bg-background border border-input rounded-md shadow-lg p-4">
    <p className="text-sm font-medium mb-2">Password requirements:</p>
    <ul className="space-y-1">
      <li className={`flex items-center ${passwordStrength.hasMinLength ? "text-success" : "text-muted-foreground"}`}>
        <div className="mr-2 h-4 w-4" />
        <span
          className="font-extrabold"
        >Required:&nbsp;</span>
        {/* space character */}
        At least {minCharacters} characters
      </li>
      <li className={`flex items-center ${passwordStrength.hasUppercase ? "text-success" : "text-muted-foreground"}`}>
        <div className="mr-2 h-4 w-4" />
        At least one uppercase letter
      </li>
      <li className={`flex items-center ${passwordStrength.hasLowercase ? "text-success" : "text-muted-foreground"}`}>
        <div className="mr-2 h-4 w-4" />
        At least one lowercase letter
      </li>
      <li className={`flex items-center ${passwordStrength.hasNumber ? "text-success" : "text-muted-foreground"}`}>
        <div className="mr-2 h-4 w-4" />
        At least one number
      </li>
      <li className={`flex items-center ${passwordStrength.passwordsMatch ? "text-success" : "text-muted-foreground"}`}>
        <div className="mr-2 h-4 w-4" />
        Passwords match
      </li>
    </ul>
  </div>
);

export function PasswordFields() {
  const [showPasswordChecklist, setShowPasswordChecklist] = useState(false)
  const passwordRef = useRef<HTMLInputElement>(null)
  const confirmPasswordRef = useRef<HTMLInputElement>(null)
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    hasMinLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    passwordsMatch: false
  })

  const updatePasswordStrength = () => {
    const password = passwordRef.current?.value || ""
    const confirmPassword = confirmPasswordRef.current?.value || ""
    const passwordStrength = {
      hasMinLength: password.length >= minCharacters,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      passwordsMatch: password === confirmPassword
    }
    console.log(passwordStrength)
    setPasswordStrength(passwordStrength)
  }

  useEffect(() => {
    return () => {
      if (passwordRef.current) passwordRef.current.value = ""
      if (confirmPasswordRef.current) confirmPasswordRef.current.value = ""
    }
  }, [])

  return (
    <>
      <label className="text-md" htmlFor="password">
        Password
      </label>
      <input
        className="rounded-md px-4 py-2 bg-inherit border mb-6"
        type="password"
        name="password"
        placeholder="••••••••"
        ref={passwordRef}
        onChange={updatePasswordStrength}
        onFocus={() => setShowPasswordChecklist(true)}
        onBlur={() => setShowPasswordChecklist(false)}
        required
      />
      <label className="text-md" htmlFor="confirm-password">
        Confirm Password
      </label>
      <input
        className="rounded-md px-4 py-2 bg-inherit border mb-6"
        type="password"
        name="confirm-password"
        placeholder="••••••••"
        ref={confirmPasswordRef}
        onChange={updatePasswordStrength}
        onFocus={() => setShowPasswordChecklist(true)}
        onBlur={() => setShowPasswordChecklist(false)}
        required
      />
      {showPasswordChecklist && <PasswordChecklist passwordStrength={passwordStrength} />}
    </>
  );
}