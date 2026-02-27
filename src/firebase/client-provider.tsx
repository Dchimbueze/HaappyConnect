'use client';

import { initializeFirebase } from '@/firebase/index';
import { FirebaseProvider } from '@/firebase/provider';

// This provider ensures that Firebase is only initialized once on the client
// and provides the Firebase instances to the rest of the application.
export default function FirebaseClientProvider({ children }: { children: React.ReactNode }) {
  const { firebaseApp, firestore, auth } = initializeFirebase();

  return (
    <FirebaseProvider firebaseApp={firebaseApp} auth={auth} firestore={firestore}>
      {children}
    </FirebaseProvider>
  );
}
