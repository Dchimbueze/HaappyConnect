'use client';

import {
  getAuth,
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
  TwitterAuthProvider,
  OAuthProvider,
  type User,
} from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { type UserProfile } from '@/lib/types';

async function socialSignIn(provider: GoogleAuthProvider | TwitterAuthProvider | OAuthProvider) {
  const { auth } = initializeFirebase();
  try {
    const result = await signInWithPopup(auth, provider);
    await createUserProfile(result.user);
    return result.user;
  } catch (error) {
    console.error("Authentication error:", error);
    // In a real app, you'd want to handle different error codes (e.g., popup closed, account exists)
    // For now, we'll just re-throw.
    throw error;
  }
}

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  return socialSignIn(provider);
}

export async function signInWithApple() {
  const provider = new OAuthProvider('apple.com');
  return socialSignIn(provider);
}

export async function signInWithTwitter() {
  const provider = new TwitterAuthProvider();
  return socialSignIn(provider);
}

export async function signInWithLinkedIn() {
  // NOTE: LinkedIn via OAuthProvider may require custom parameters and advanced setup in Firebase console.
  const provider = new OAuthProvider('linkedin.com');
  return socialSignIn(provider);
}


export async function signOutUser() {
  const { auth } = initializeFirebase();
  await signOut(auth);
}

async function createUserProfile(user: User) {
  const { firestore } = initializeFirebase();
  if (!firestore) return;

  const userRef = doc(firestore, 'users', user.uid);
  const userProfile: Partial<UserProfile> = {
    uid: user.uid,
    name: user.displayName,
    email: user.email,
    photoURL: user.photoURL,
  };
  
  // Use setDoc with merge: true to create or update the document without overwriting existing fields
  // like 'role', 'bio' which will be set during onboarding.
  setDoc(userRef, userProfile, { merge: true }).catch(async (serverError) => {
    const permissionError = new FirestorePermissionError({
      path: userRef.path,
      operation: 'write',
      requestResourceData: userProfile,
    });
    errorEmitter.emit('permission-error', permissionError);
  });
}

export function updateUserProfile(uid: string, data: Partial<UserProfile>) {
  const { firestore } = initializeFirebase();
  if (!firestore) {
    console.error("Firestore not initialized, cannot update user profile.");
    return Promise.reject(new Error("Firestore not initialized"));
  }

  const userRef = doc(firestore, 'users', uid);

  return setDoc(userRef, data, { merge: true }).catch(async (serverError) => {
    const permissionError = new FirestorePermissionError({
      path: userRef.path,
      operation: 'update',
      requestResourceData: data,
    });
    errorEmitter.emit('permission-error', permissionError);
    throw serverError; // Re-throw to be handled by the caller
  });
}
