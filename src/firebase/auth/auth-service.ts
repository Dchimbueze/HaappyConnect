'use client';

import {
  getAuth,
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
  type User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { type UserProfile } from '@/lib/types';

async function socialSignIn(provider: GoogleAuthProvider) {
  const { auth } = initializeFirebase();
  try {
    const result = await signInWithPopup(auth, provider);
    await createUserProfile(result.user);
    return result.user;
  } catch (error) {
    // The UI components that call this function will handle showing a toast.
    // We just need to make sure the error propagates up.
    throw error;
  }
}

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  return socialSignIn(provider);
}

export async function signUpWithEmailPassword(name: string, email: string, password: string) {
    const { auth } = initializeFirebase();
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      // Update the user's profile with their name
      await updateProfile(result.user, { displayName: name });
      // Create the user profile in Firestore
      await createUserProfile(result.user);
      return result.user;
    } catch (error) {
      throw error;
    }
}

export async function signInWithEmailPassword(email: string, password: string) {
    const { auth } = initializeFirebase();
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result.user;
    } catch (error) {
      throw error;
    }
}


export async function signOutUser() {
  const { auth } = initializeFirebase();
  await signOut(auth);
}

async function createUserProfile(user: User) {
  const { firestore } = initializeFirebase();
  if (!firestore) {
    throw new Error("Firestore not initialized, cannot create user profile.");
  }

  const userRef = doc(firestore, 'users', user.uid);
  const userProfile: Partial<UserProfile> = {
    uid: user.uid,
    name: user.displayName,
    email: user.email,
    photoURL: user.photoURL,
  };
  
  try {
    // Use setDoc with merge: true to create or update the document without overwriting existing fields
    // like 'role', 'bio' which will be set during onboarding.
    await setDoc(userRef, userProfile, { merge: true });
  } catch (serverError) {
    const permissionError = new FirestorePermissionError({
      path: userRef.path,
      operation: 'write',
      requestResourceData: userProfile,
    });
    errorEmitter.emit('permission-error', permissionError);
    // Re-throw the original error so the caller can handle it and show a toast.
    throw serverError;
  }
}

export async function updateUserProfile(uid: string, data: Partial<UserProfile>) {
  const { firestore } = initializeFirebase();
  if (!firestore) {
    throw new Error("Firestore not initialized, cannot update user profile.");
  }

  const userRef = doc(firestore, 'users', uid);

  try {
    await setDoc(userRef, data, { merge: true });
  } catch (serverError) {
    const permissionError = new FirestorePermissionError({
      path: userRef.path,
      operation: 'update',
      requestResourceData: data,
    });
    errorEmitter.emit('permission-error', permissionError);
    // Re-throw to be handled by the caller in the UI.
    throw serverError;
  }
}
