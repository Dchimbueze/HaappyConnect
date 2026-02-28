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
  getAdditionalUserInfo,
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
    const additionalInfo = getAdditionalUserInfo(result);
    // Only create a profile document if the user is new
    if (additionalInfo?.isNewUser) {
      await createUserProfile(result.user);
    }
    return result.user;
  } catch (error) {
    // The calling function will add more detailed logging.
    // We just need to make sure the error propagates up.
    throw error;
  }
}

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  try {
    return await socialSignIn(provider);
  } catch (error: any) {
    console.error(
      "GOOGLE SIGN-IN FAILED. This is the specific error from Firebase:"
    );
    console.error("Error Code:", error.code);
    console.error("Error Message:", error.message);
    
    // This error often means your .env.local file is not configured correctly
    // OR the domain you are running the app on is not in the 'Authorized Domains' list
    // in your Firebase project's Authentication settings.
    if (error.code === 'auth/operation-not-allowed') {
        console.error("ACTION: Ensure 'Google' is enabled as a Sign-in provider in the Firebase console and that your domain is authorized.");
    }
    
    // Re-throw the original error to be handled by the UI.
    throw error;
  }
}

export async function signUpWithEmailPassword(name: string, email: string, password: string) {
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

export async function signInWithEmailPassword(email: string, password: string) {
    const { auth } = initializeFirebase();
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
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

async function createUserProfile(user: User, customData: Partial<UserProfile> = {}) {
  const { firestore } = initializeFirebase();
  if (!firestore) {
    throw new Error("Firestore not initialized, cannot create user profile.");
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
  } catch(serverError: any) {
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

export async function updateUserProfile(uid: string, data: Partial<UserProfile>) {
  const { firestore } = initializeFirebase();
  if (!firestore) {
    throw new Error("Firestore not initialized, cannot update user profile.");
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
