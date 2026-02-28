'use client';

import {
  getAuth,
  signOut,
  GoogleAuthProvider,
  type User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword as firebaseSignInWithEmailPassword,
  updateProfile,
  getAdditionalUserInfo,
  signInWithRedirect,
  getRedirectResult,
} from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { type UserProfile } from '@/lib/types';

export async function signInWithGoogle() {
  const { auth } = initializeFirebase();
  const provider = new GoogleAuthProvider();
  try {
    await signInWithRedirect(auth, provider);
  } catch (error: any) {
    console.error(
      'GOOGLE SIGN-IN FAILED. This is the specific error from Firebase:',
      error
    );
    console.error('Error Code:', error.code);
    console.error('Error Message:', error.message);
    throw error;
  }
}

export async function processGoogleRedirect() {
  const { auth } = initializeFirebase();
  try {
    const result = await getRedirectResult(auth);
    if (result) {
      // This is the successfully signed-in user
      const user = result.user;
      const additionalInfo = getAdditionalUserInfo(result);
      if (additionalInfo?.isNewUser) {
        // If it's a new user, create a profile document
        await createUserProfile(user);
      }
      return { user, isNew: additionalInfo?.isNewUser ?? false, error: null };
    }
    return { user: null, isNew: false, error: null };
  } catch (error: any) {
    // Avoid showing toasts for common non-errors during redirect checks.
    if (
      error.code !== 'auth/web-storage-unsupported' &&
      error.code !== 'auth/operation-not-supported-in-this-environment'
    ) {
      console.error('GOOGLE REDIRECT SIGN-IN FAILED:', error);
    }
    // Pass the error back to the caller to be handled in the UI
    return { user: null, isNew: false, error };
  }
}

export async function signUpWithEmailPassword(
  name: string,
  email: string,
  password: string
) {
  const { auth } = initializeFirebase();
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    // Update the user's profile with their name
    await updateProfile(result.user, { displayName: name });
    // Create the user profile in Firestore, passing the name explicitly
    await createUserProfile(result.user, { name });
    return result.user;
  } catch (error) {
    // Let the UI component handle showing the toast.
    throw error;
  }
}

export async function signInWithEmailAndPassword(email: string, password: string) {
    const { auth } = initializeFirebase();
    try {
      const result = await firebaseSignInWithEmailPassword(auth, email, password);
      return result.user;
    } catch (error) {
      // Let the UI component handle showing the toast.
      throw error;
    }
}


export async function signOutUser() {
  const { auth } = initializeFirebase();
  await signOut(auth);
}

async function createUserProfile(
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
    // Use setDoc with merge: true to create or update the document without overwriting existing fields
    // like 'role', 'bio' which will be set during onboarding.
    await setDoc(userRef, userProfile, { merge: true });
  } catch (serverError: any) {
    const permissionError = new FirestorePermissionError({
      path: userRef.path,
      operation: 'write',
      requestResourceData: userProfile,
    });
    errorEmitter.emit('permission-error', permissionError);
    // Re-throw the original error so the caller can handle it.
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
    // Re-throw to be handled by the caller in the UI.
    throw serverError;
  }
}
