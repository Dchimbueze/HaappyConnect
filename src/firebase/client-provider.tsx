'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { initializeFirebase } from '@/firebase/index';
import { FirebaseProvider } from '@/firebase/provider';
import { processGoogleRedirect } from '@/firebase/auth/auth-service';
import { useToast } from '@/hooks/use-toast';

/**
 * This component's sole responsibility is to check for a redirect result from Firebase Auth
 * when the application first loads. It should only run once.
 */
function RedirectProcessor() {
  const router = useRouter();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    // This effect should only run once on initial component mount.
    let isMounted = true;

    async function handleRedirect() {
      try {
        const { user, isNew, error } = await processGoogleRedirect();

        if (!isMounted) return;

        if (error) {
          // Let the UI handle specific errors if needed, but for now, we'll log them.
          console.error("Redirect processing error:", error);
          if (error.code !== 'auth/web-storage-unsupported' && error.code !== 'auth/operation-not-supported-in-this-environment') {
            toast({
              variant: "destructive",
              title: "Sign In Failed",
              description: "An unexpected error occurred during sign-in. Please try again.",
            });
          }
          return;
        }

        if (user) {
          toast({
            title: "Signed In",
            description: `Welcome back, ${user.displayName}!`,
          });
          // Redirect the user to the appropriate page.
          if (isNew) {
            router.push('/onboarding');
          } else {
            router.push('/browse');
          }
        }
      } catch (e: any) {
         if (isMounted) {
            console.error("Unhandled exception during redirect processing:", e);
             toast({
              variant: "destructive",
              title: "Sign In Failed",
              description: e.message || "An unexpected error occurred.",
            });
         }
      } finally {
        if (isMounted) {
          setIsProcessing(false);
        }
      }
    }

    handleRedirect();

    return () => {
      isMounted = false;
    };
  }, [router, toast]);


  // While processing, we can render nothing or a global loader.
  // For now, returning null is sufficient as the page behind will be visible.
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
