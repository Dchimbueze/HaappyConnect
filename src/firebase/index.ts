
import { getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { firebaseConfig } from './config';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';

let firebaseApp: FirebaseApp | null = null;
let auth: Auth | null = null;
let firestore: Firestore | null = null;

function initializeFirebase() {
  if (
    !firebaseConfig.apiKey ||
    !firebaseConfig.authDomain ||
    !firebaseConfig.projectId ||
    firebaseConfig.apiKey.startsWith('REPLACE_WITH_YOUR_')
  ) {
    throw new Error(
      'Firebase config is not set correctly. Please copy the values from your Firebase project settings into the .env.local file.'
    );
  }

  if (!firebaseApp) {
    const apps = getApps();
    firebaseApp = apps.length ? apps[0] : initializeApp(firebaseConfig);
    auth = getAuth(firebaseApp);
    firestore = getFirestore(firebaseApp);
  }

  return { firebaseApp, auth, firestore };
}

import {
  FirebaseProvider,
  useFirebase,
  useFirebaseApp,
  useFirestore,
  useAuth,
} from './provider';
import FirebaseClientProvider from './client-provider';
import { useCollection } from './firestore/use-collection';
import { useDoc } from './firestore/use-doc';
import { useUser } from './auth/use-user';
import { useMemoFirebase } from '@/hooks/use-memo-firebase';

export {
  initializeFirebase,
  FirebaseProvider,
  FirebaseClientProvider,
  FirebaseErrorListener,
  useCollection,
  useDoc,
  useUser,
  useFirebase,
  useFirebaseApp,
  useFirestore,
  useAuth,
  useMemoFirebase,
};
