'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '@/lib/firebase';

export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isGuest?: boolean;
}

interface AuthContextType {
  user: User | AppUser | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name?: string) => Promise<void>;
  signInAsGuest: (name?: string, email?: string) => void;
  signOutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signInWithGoogle: async () => {},
  signInWithEmail: async () => {},
  signUpWithEmail: async () => {},
  signInAsGuest: () => {},
  signOutUser: async () => {},
});

const GUEST_STORAGE_KEY = 'autoflow_guest_session';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if there is an active Firebase Auth session first
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setLoading(false);

        try {
          const userRef = doc(db, 'users', currentUser.uid);
          const userSnap = await getDoc(userRef);
          if (!userSnap.exists()) {
            await setDoc(userRef, {
              id: currentUser.uid,
              email: currentUser.email || '',
              displayName: currentUser.displayName || 'User',
              photoURL: currentUser.photoURL || '',
              createdAt: new Date().toISOString(),
            });
          }
        } catch {
          // Non-blocking write
        }
      } else {
        // If no Firebase user, check for saved guest session
        try {
          const savedGuest = localStorage.getItem(GUEST_STORAGE_KEY);
          if (savedGuest) {
            setUser(JSON.parse(savedGuest));
          } else {
            setUser(null);
          }
        } catch {
          setUser(null);
        }
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        localStorage.removeItem(GUEST_STORAGE_KEY);
        try {
          const userRef = doc(db, 'users', result.user.uid);
          await setDoc(
            userRef,
            {
              id: result.user.uid,
              email: result.user.email || '',
              displayName: result.user.displayName || 'User',
              photoURL: result.user.photoURL || '',
              lastLogin: new Date().toISOString(),
            },
            { merge: true }
          );
        } catch {
          // Non-blocking write
        }
      }
    } catch (err: any) {
      throw err;
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      localStorage.removeItem(GUEST_STORAGE_KEY);
    } catch (err: any) {
      throw err;
    }
  };

  const signUpWithEmail = async (email: string, pass: string, name?: string) => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      localStorage.removeItem(GUEST_STORAGE_KEY);
      if (name && cred.user) {
        await updateProfile(cred.user, { displayName: name });
      }
    } catch (err: any) {
      throw err;
    }
  };

  const signInAsGuest = (name = 'Developer User', email = 'developer@autoflow.ai') => {
    const guestUser: AppUser = {
      uid: 'guest_' + Math.random().toString(36).substring(2, 10),
      displayName: name,
      email: email,
      photoURL: null,
      isGuest: true,
    };
    try {
      localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(guestUser));
    } catch {
      // Ignored
    }
    setUser(guestUser);
  };

  const signOutUser = async () => {
    try {
      localStorage.removeItem(GUEST_STORAGE_KEY);
      await signOut(auth);
    } catch {
      // Ignored
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        signInAsGuest,
        signOutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
