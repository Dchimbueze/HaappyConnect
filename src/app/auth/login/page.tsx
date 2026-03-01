'use client';

import { useState } from 'react';
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
import { Eye, EyeOff, Briefcase } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import {
  signInUserWithEmailPassword,
  signInWithGoogle,
} from '@/firebase/auth/auth-service';

export default function LoginPage() {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleEmailLogin = async () => {
    if (!email || !password) {
      toast({
        variant: "destructive",
        title: "Missing fields",
        description: "Please enter both email and password.",
      });
      return;
    }
    try {
      await signInUserWithEmailPassword(email, password);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error.message || "An unexpected error occurred. Please try again.",
      });
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Sign In Failed',
        description:
          error.code === 'auth/popup-closed-by-user'
            ? 'The sign-in popup was closed before completing. Please try again.'
            : error.message || 'An unexpected error occurred. Please try again.',
      });
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <Link href="/" className="flex items-center justify-center space-x-2">
            <Briefcase className="h-7 w-7 text-primary" />
            <span className="font-headline text-2xl font-bold">
              HappyConnect
            </span>
          </Link>
          <div className='!mt-4'>
            <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
            <CardDescription>
              Enter your credentials to access your account.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" className="w-full" onClick={handleGoogleLogin}>
            <svg role="img" viewBox="0 0 24 24" className="mr-2 h-4 w-4"><path fill="currentColor" d="M21.543 9.75h-8.29v4.5h4.843c-.545 2.5-2.245 4.5-4.843 4.5-2.97 0-5.4-2.43-5.4-5.4s2.43-5.4 5.4-5.4c1.282 0 2.457.445 3.393 1.335l3.224-3.224C17.636 2.018 15.082 0 11.953 0 5.34 0 0 5.34 0 11.953s5.34 11.953 11.953 11.953c6.43 0 11.45-5.11 11.45-11.453 0-.756-.068-1.5-.192-2.25h-.668z"></path></svg>
            Continue with Google
          </Button>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="relative space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
              type={showPassword ? 'text' : 'password'} 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-1 top-6 h-7 w-7 text-muted-foreground"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              <span className="sr-only">{showPassword ? 'Hide password' : 'Show password'}</span>
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button className="w-full" onClick={handleEmailLogin}>
            Login
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link
              href="/auth/signup"
              className="font-semibold text-primary underline-offset-4 hover:underline"
            >
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
