'use client';

import {
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  signInWithEmailAndPassword as firebaseSignInWithEmailAndPassword,
  type User,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
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
  try {
    const result = await signInWithPopup(auth, provider);
    await createUserProfile(result.user);
    window.location.href = '/browse';
  } catch (error: any) {
    console.error('GOOGLE SIGN-IN FAILED. This is the specific error from Firebase:');
    console.error('Error Code:', error.code);
    console.error('Error Message:', error.message);
    // Re-throw the error to be handled by the calling component
    throw error;
  }
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
  const result = await createUserWithEmailAndPassword(auth, email, password);
  // Update the Firebase Auth profile
  await updateProfile(result.user, { displayName: name });
  // Create the user profile document in Firestore
  await createUserProfile(result.user);
  window.location.href = '/browse';
}

export async function signInUserWithEmailPassword(email: string, password: string) {
    const { auth } = initializeFirebase();
    if (!auth) {
        throw new Error('Firebase Auth is not initialized.');
    }
    await firebaseSignInWithEmailAndPassword(auth, email, password);
    window.location.href = '/browse';
}

export async function signOutUser() {
  const { auth } = initializeFirebase();
  if (!auth) {
    throw new Error('Firebase Auth is not initialized.');
  }
  await signOut(auth);
  window.location.href = '/';
}

/**
 * Creates or updates a user profile document in Firestore.
 * This is intended to be called for new users or after a social sign-in.
 */
export async function createUserProfile(
  user: User,
  customData: Partial<UserProfile> = {}
) {
  const { firestore } = initializeFirebase();
  if (!firestore) {
    throw new Error('Firestore not initialized, cannot create user profile.');
  }

  const userRef = doc(firestore, 'users', user.uid);
  const userProfile: UserProfile = {
    uid: user.uid,
    name: customData.name || user.displayName,
    email: user.email,
    photoURL: user.photoURL,
    role: customData.role || 'seeker', // Default role
    bio: customData.bio || '',
    title: customData.title || '',
  };

  try {
    // Use merge:true to create the doc or update it if it already exists.
    // This is useful for social sign-ins where the user might already have a profile.
    await setDoc(userRef, userProfile, { merge: true });
  } catch (serverError) {
    const permissionError = new FirestorePermissionError({
      path: userRef.path,
      operation: 'write',
      requestResourceData: userProfile,
    });
    errorEmitter.emit('permission-error', permissionError);
    // Re-throw so the calling function can handle it
    throw serverError;
  }
}


/**
 * Updates an existing user profile document in Firestore.
 */
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
  } catch (serverError) {
    const permissionError = new FirestorePermissionError({
      path: userRef.path,
      operation: 'update',
      requestResourceData: data,
    });
    errorEmitter.emit('permission-error', permissionError);
     // Re-throw so the calling function can handle it
    throw serverError;
  }
}
