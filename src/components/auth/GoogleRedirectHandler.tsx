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
    // This effect should only run once, and only when auth is available.
    if (!auth) {
      // If auth is not ready, we wait. We should not set processing to false yet.
      return;
    }

    const processRedirect = async () => {
      try {
        const result = await getRedirectResult(auth);
        
        if (result) {
          // A sign-in redirect just happened. We are now processing it.
          // The `processing` state will keep the loader visible.
          const additionalInfo = getAdditionalUserInfo(result);
          
          if (additionalInfo?.isNewUser) {
            createUserProfile(result.user);
            toast({
              title: 'Account Created',
              description: `Welcome, ${result.user.displayName}! Let's get you set up.`,
            });
            // Use window.location.href for reliable redirection.
            window.location.href = '/onboarding';
          } else {
            toast({
              title: 'Signed In',
              description: `Welcome back, ${result.user.displayName}!`,
            });
             // Use window.location.href for reliable redirection.
            window.location.href = '/browse';
          }
          // We don't set processing to false because the page is about to navigate away.
        } else {
          // No redirect result. This is a normal page load.
          // We can stop showing the loader.
          setProcessing(false);
        }
      } catch (error: any) {
        console.error('Google Sign-In Redirect Error:', error);
        toast({
          variant: 'destructive',
          title: 'Sign In Failed',
          description: error.message || 'An unexpected error occurred during sign-in.',
        });
        setProcessing(false);
        // On error, send them back to login just in case.
        window.location.href = '/auth/login';
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
