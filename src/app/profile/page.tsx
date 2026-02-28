'use client';

import { useUser } from '@/firebase';
import { signOutUser } from '@/firebase/auth/auth-service';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { LogOut, Mail, User as UserIcon, Shield } from 'lucide-react';
import { useDoc } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { type UserProfile } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { useMemoFirebase } from '@/firebase';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, loading: authLoading } = useUser();
  const firestore = useFirestore();

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);
  
  const { data: userProfile, loading: profileLoading } = useDoc<UserProfile>(userDocRef);

  const loading = authLoading || profileLoading;

  if (loading) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-8">
        <Card>
          <CardHeader className="items-center text-center">
            <Skeleton className="h-24 w-24 rounded-full" />
            <Skeleton className="h-8 w-48 mt-4" />
            <Skeleton className="h-4 w-64 mt-2" />
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
             <div className="border-t pt-6">
                <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-8 text-center">
        <Card className='py-12'>
            <CardHeader>
                <CardTitle>You are not logged in</CardTitle>
                <CardDescription>Please log in to view your profile.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button asChild>
                    <Link href="/auth/login">Log In</Link>
                </Button>
            </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <Card>
        <CardHeader className="items-center text-center">
          <Avatar className="h-24 w-24 border-2 border-primary">
            <AvatarImage src={user.photoURL ?? undefined} alt={user.displayName ?? ''} data-ai-hint="user avatar" />
            <AvatarFallback className="text-3xl">
              {user.displayName ? user.displayName.charAt(0).toUpperCase() : <UserIcon />}
            </AvatarFallback>
          </Avatar>
          <CardTitle className="pt-4 font-headline text-3xl">
            {userProfile?.name || user.displayName}
          </CardTitle>
          <CardDescription>{userProfile?.title || 'No title provided'}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="space-y-4">
                 <div className="flex items-center gap-4">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <span>{user.email}</span>
                </div>
                 <div className="flex items-center gap-4">
                    <Shield className="h-5 w-5 text-muted-foreground" />
                    <div className="flex items-center gap-2">
                        <span>Role:</span>
                        <Badge variant="secondary" className="capitalize">{userProfile?.role || 'Seeker'}</Badge>
                    </div>
                </div>
            </div>
          
            <div className="border-t pt-6">
                <Button onClick={signOutUser} variant="outline" className="w-full">
                    <LogOut />
                    Sign Out
                </Button>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
