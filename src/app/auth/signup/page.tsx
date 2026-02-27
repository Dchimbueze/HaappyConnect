
'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChromeIcon, Linkedin, Twitter } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import {
  signInWithGoogle,
  signInWithApple,
  signInWithTwitter,
  signInWithLinkedIn,
} from '@/firebase/auth/auth-service';


const AppleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg role="img" viewBox="0 0 24 24" {...props}>
      <path
        d="M12.152 6.896c-.922 0-1.854.488-2.553 1.22-1.39 1.458-2.622 3.966-2.622 6.541 0 2.29.984 4.52 2.333 6.012.67.733 1.533 1.343 2.652 1.343.921 0 1.853-.488 2.552-1.22 1.39-1.457 2.622-3.965 2.622-6.541 0-2.29-.984-4.52-2.333-6.012-.67-.733-1.532-1.343-2.651-1.343zm1.964-3.359c.797.025 1.53.38 2.015.897.434.464.743 1.05.803 1.705-.025.05-.05.1-.075.149-.248.485-.568.924-.954 1.301-.433.434-.96.743-1.556.896-.797-.025-1.53-.38-2.015-.897-.434-.464-.743-1.05-.803-1.705.025-.05.05-.1.075-.149.248-.485-.568.924.954-1.301.433-.434.96-.743 1.556-.896z"
        fill="currentColor"
      />
    </svg>
);

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();

  const handleSocialSignUp = async (loginProvider: () => Promise<any>) => {
    try {
      await loginProvider();
      router.push('/onboarding');
    } catch (error: any) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Sign Up Failed",
        description: error.message || "An unexpected error occurred. Please try again.",
      });
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Create an Account</CardTitle>
          <CardDescription>
            Join HaappyConnect to find or offer expert advice.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
             <Button variant="outline" onClick={() => handleSocialSignUp(signInWithGoogle)}><ChromeIcon className="mr-2 h-4 w-4" /> Google</Button>
             <Button variant="outline" onClick={() => handleSocialSignUp(signInWithApple)}><AppleIcon className="mr-2 h-4 w-4" /> Apple</Button>
             <Button variant="outline" onClick={() => handleSocialSignUp(signInWithLinkedIn)}><Linkedin className="mr-2 h-4 w-4" /> LinkedIn</Button>
             <Button variant="outline" onClick={() => handleSocialSignUp(signInWithTwitter)}><Twitter className="mr-2 h-4 w-4" /> X</Button>
          </div>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Or continue with email
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" placeholder="John Doe" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="m@example.com" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button className="w-full" onClick={() => toast({ title: 'Coming Soon!', description: 'Email/Password signup will be implemented soon.' })}>
            Create Account
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link
              href="/auth/login"
              className="font-semibold text-primary underline-offset-4 hover:underline"
            >
              Login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
