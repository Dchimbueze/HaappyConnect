'use client';

import { useEffect, useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { initializeFirebase } from '@/firebase/index';
import { FirebaseProvider } from '@/firebase/provider';
import { processGoogleRedirect } from '@/firebase/auth/auth-service';
import { useToast } from '@/hooks/use-toast';
import { useUser } from './auth/use-user';

function RedirectProcessor() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, loading } = useUser();
  const [isProcessing, setIsProcessing] = useState(true);

  const process = useCallback(async () => {
    // This function is now only called once when auth is no longer loading.
    try {
      const { user: redirectedUser, isNew, error } = await processGoogleRedirect();
      
      if (error) {
        throw error;
      }
      
      if (redirectedUser) {
        toast({
          title: "Signed In",
          description: `Welcome back, ${redirectedUser.displayName}!`,
        });
        if (isNew) {
          router.push('/onboarding');
        } else {
          router.push('/browse');
        }
      }
    } catch (error: any) {
      // Avoid showing toasts for common non-errors during redirect checks.
      if (error.code !== 'auth/web-storage-unsupported' && error.code !== 'auth/operation-not-supported-in-this-environment') {
        toast({
          variant: "destructive",
          title: "Sign In Failed",
          description: error.message || "An unexpected error occurred during sign-in.",
        });
      }
    } finally {
      setIsProcessing(false);
    }
  }, [router, toast]);

  useEffect(() => {
    // When auth is loaded and we are not already logged in, process the redirect.
    if (!loading && !user && isProcessing) {
      process();
    } else if (!loading && user) {
        // If user is already logged in, no need to process.
        setIsProcessing(false);
    }
  }, [loading, user, isProcessing, process]);

  return null;
}


// This provider ensures that Firebase is only initialized once on the client
// and provides the Firebase instances to the rest of the application.
export default function FirebaseClientProvider({ children }: { children: React.ReactNode }) {
  const { firebaseApp, firestore, auth } = initializeFirebase();

  return (
    <FirebaseProvider firebaseApp={firebaseApp} auth={auth} firestore={firestore}>
      <RedirectProcessor />
      {children}
    </FirebaseProvider>
  );
}
