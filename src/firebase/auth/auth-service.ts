'use client';

import {
  getAuth,
  signOut,
  GoogleAuthProvider,
  type User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword as firebaseSignInWithEmailAndPassword,
  updateProfile,
  getAdditionalUserInfo,
  signInWithPopup,
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
    const result = await signInWithPopup(auth, provider);
    const additionalInfo = getAdditionalUserInfo(result);
    if (additionalInfo?.isNewUser) {
      await createUserProfile(result.user);
    }
    return { user: result.user, isNew: additionalInfo?.isNewUser ?? false };
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

export async function signInUserWithEmailPassword(email: string, password: string) {
    const { auth } = initializeFirebase();
    try {
      const result = await firebaseSignInWithEmailAndPassword(auth, email, password);
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
