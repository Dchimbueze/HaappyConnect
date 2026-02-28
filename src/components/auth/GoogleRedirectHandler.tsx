'use client';

import { useEffect, useState } from 'react';
import { getRedirectResult, getAdditionalUserInfo } from 'firebase/auth';
import { useAuth } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { createUserProfile } from '@/firebase/auth/auth-service';
import { Loader2 } from 'lucide-react';

export default function GoogleRedirectHandler() {
  const auth = useAuth();
  const { toast } = useToast();
  const [processing, setProcessing] = useState(true);

  useEffect(() => {
    console.log("GoogleRedirectHandler: useEffect triggered.");
    if (!auth) {
      console.log("GoogleRedirectHandler: Auth service not available yet. Waiting.");
      // If auth is not ready, we wait. We should not set processing to false yet.
      return;
    }

    const processRedirect = async () => {
      console.log("GoogleRedirectHandler: Starting to process redirect result.");
      try {
        const result = await getRedirectResult(auth);
        
        if (result) {
          console.log("GoogleRedirectHandler: Redirect result found.", result);
          const additionalInfo = getAdditionalUserInfo(result);
          
          if (additionalInfo?.isNewUser) {
            console.log("GoogleRedirectHandler: New user detected. Creating profile.");
            await createUserProfile(result.user);
            console.log("GoogleRedirectHandler: Profile created. Redirecting to /onboarding.");
            toast({
              title: 'Account Created',
              description: `Welcome, ${result.user.displayName}! Let's get you set up.`,
            });
            window.location.href = '/onboarding';
          } else {
            console.log("GoogleRedirectHandler: Existing user detected. Redirecting to /browse.");
            toast({
              title: 'Signed In',
              description: `Welcome back, ${result.user.displayName}!`,
            });
            window.location.href = '/browse';
          }
          // We don't set processing to false because the page is about to navigate away.
        } else {
          console.log("GoogleRedirectHandler: No redirect result. Normal page load.");
          // No redirect result. This is a normal page load.
          // We can stop showing the loader.
          setProcessing(false);
        }
      } catch (error: any) {
        console.error('GoogleRedirectHandler: Error processing redirect.', error);
        toast({
          variant: 'destructive',
          title: 'Sign In Failed',
          description: error.message || 'An unexpected error occurred during sign-in.',
        });
        setProcessing(false);
      }
    };

    processRedirect();
    // The dependency array ensures this runs only when `auth` is initialized.
  }, [auth, toast]);

  if (processing) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <p className="text-lg font-medium">Processing sign-in...</p>
        </div>
      </div>
    );
  }

  // Render nothing if not processing a redirect.
  return null;
}
