'use client';

import {
  getAuth,
  signOut,
  GoogleAuthProvider,
  type User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword as firebaseSignInWithEmailAndPassword,
  updateProfile,
  signInWithRedirect,
} from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { type UserProfile } from '@/lib/types';

export async function signInWithGoogle() {
  const { auth } = initializeFirebase();
  if (!auth) {
    throw new Error('Firebase Auth is not initialized.');
  }
  const provider = new GoogleAuthProvider();
  // Using signInWithRedirect instead of signInWithPopup to avoid cross-origin issues.
  await signInWithRedirect(auth, provider);
}

export async function signUpWithEmailPassword(
  name: string,
  email: string,
  password: string
) {
  const { auth } = initializeFirebase();
  if (!auth) {
    throw new Error('Firebase Auth is not initialized.');
  }
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(result.user, { displayName: name });
    await createUserProfile(result.user, { name });
    return result.user;
  } catch (error) {
    throw error;
  }
}

export async function signInUserWithEmailPassword(email: string, password: string) {
    const { auth } = initializeFirebase();
    if (!auth) {
        throw new Error('Firebase Auth is not initialized.');
    }
    try {
      const result = await firebaseSignInWithEmailAndPassword(auth, email, password);
      return result.user;
    } catch (error) {
      throw error;
    }
}

export async function signOutUser() {
  const { auth } = initializeFirebase();
  if (!auth) {
    throw new Error('Firebase Auth is not initialized.');
  }
  await signOut(auth);
}

export async function createUserProfile(
  user: User,
  customData: Partial<UserProfile> = {}
) {
  const { firestore } = initializeFirebase();
  if (!firestore) {
    throw new Error('Firestore not initialized, cannot create user profile.');
  }

  const userRef = doc(firestore, 'users', user.uid);
  const userProfile: Partial<UserProfile> = {
    uid: user.uid,
    name: customData.name || user.displayName,
    email: user.email,
    photoURL: user.photoURL,
    ...customData,
  };

  try {
    await setDoc(userRef, userProfile, { merge: true });
  } catch (serverError: any) {
    const permissionError = new FirestorePermissionError({
      path: userRef.path,
      operation: 'write',
      requestResourceData: userProfile,
    });
    errorEmitter.emit('permission-error', permissionError);
    throw serverError;
  }
}

export async function updateUserProfile(
  uid: string,
  data: Partial<UserProfile>
) {
  const { firestore } = initializeFirebase();
  if (!firestore) {
    throw new Error('Firestore not initialized, cannot update user profile.');
  }

  const userRef = doc(firestore, 'users', uid);

  try {
    await setDoc(userRef, data, { merge: true });
  } catch (serverError: any) {
    const permissionError = new FirestorePermissionError({
      path: userRef.path,
      operation: 'update',
      requestResourceData: data,
    });
    errorEmitter.emit('permission-error', permissionError);
    throw serverError;
  }
}
