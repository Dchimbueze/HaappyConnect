'use client';

import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithRedirect,
  signOut,
  updateProfile,
  signInWithEmailAndPassword as firebaseSignInWithEmailAndPassword,
  type User,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { type UserProfile } from '@/lib/types';

/**
 * Initiates the Google sign-in process using a redirect.
 */
export async function signInWithGoogle() {
  console.log("auth-service: signInWithGoogle initiated.");
  const { auth } = initializeFirebase();
  if (!auth) {
    console.error("auth-service: Firebase Auth is not initialized.");
    throw new Error('Firebase Auth is not initialized.');
  }
  console.log("auth-service: Auth service obtained. Preparing for redirect.");
  const provider = new GoogleAuthProvider();
  // We use signInWithRedirect to avoid issues with popups being blocked.
  // The result of this is handled in the GoogleRedirectHandler component.
  await signInWithRedirect(auth, provider);
  console.log("auth-service: signInWithRedirect has been called. User should be redirecting now.");
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
  return result.user;
}

export async function signInUserWithEmailPassword(email: string, password: string) {
    const { auth } = initializeFirebase();
    if (!auth) {
        throw new Error('Firebase Auth is not initialized.');
    }
    return await firebaseSignInWithEmailAndPassword(auth, email, password);
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
 * Creates a user profile document in Firestore.
 * This is intended to be called for new users.
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
    await setDoc(userRef, userProfile, { merge: true });
  } catch (serverError) {
    const permissionError = new FirestorePermissionError({
      path: userRef.path,
      operation: 'create',
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
