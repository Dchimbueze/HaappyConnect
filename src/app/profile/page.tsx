
'use client';

import { useState } from 'react';
import { useUser } from '@/firebase';
import { signOutUser, updateUserProfile } from '@/firebase/auth/auth-service';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { LogOut, Mail, User as UserIcon, Shield, Edit, Loader2 } from 'lucide-react';
import { useDoc } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { type UserProfile } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { useMemoFirebase } from '@/firebase';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';


const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  title: z.string().optional(),
  bio: z.string().max(300, 'Bio must be 300 characters or less.').optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { user, loading: authLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);
  
  const { data: userProfile, loading: profileLoading } = useDoc<UserProfile>(userDocRef);
  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    values: {
      name: userProfile?.name || user?.displayName || '',
      title: userProfile?.title || '',
      bio: userProfile?.bio || '',
    },
    mode: 'onChange',
  });

  async function onSubmit(data: ProfileFormValues) {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to update your profile.",
      });
      return;
    }

    try {
      await updateUserProfile(user.uid, data);
      toast({
        title: "Profile Updated",
        description: "Your profile information has been saved.",
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "Could not save your profile. Please try again.",
      });
    }
  }


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
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardHeader className="items-center text-center">
                <Avatar className="h-24 w-24 border-2 border-primary">
                <AvatarImage src={user.photoURL ?? undefined} alt={user.displayName ?? ''} data-ai-hint="user avatar" />
                <AvatarFallback className="text-3xl">
                    {user.displayName ? user.displayName.charAt(0).toUpperCase() : <UserIcon />}
                </AvatarFallback>
                </Avatar>
                
                {isEditing ? (
                   <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem className="w-full pt-4">
                        <FormControl>
                            <Input placeholder="e.g., Jane Doe" {...field} className="text-center text-3xl font-bold font-headline h-auto p-0 border-0 shadow-none focus-visible:ring-0" />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                ) : (
                    <CardTitle className="pt-4 font-headline text-3xl">
                        {userProfile?.name || user.displayName}
                    </CardTitle>
                )}

                {isEditing ? (
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem className="w-full">
                            <FormControl>
                                <Input placeholder="Your Title or Headline" {...field} className="text-center text-muted-foreground h-auto p-0 border-0 shadow-none focus-visible:ring-0" />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                ): (
                    <CardDescription>{userProfile?.title || 'No title provided'}</CardDescription>
                )}
            </CardHeader>
            <CardContent className="space-y-6">
                {isEditing ? (
                    <FormField
                        control={form.control}
                        name="bio"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Bio</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Tell us a little bit about yourself..."
                                        rows={4}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                ) : (
                    <>
                        {userProfile?.bio && <p className="text-center text-muted-foreground p-4 border rounded-md bg-muted/20">{userProfile.bio}</p>}
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
                    </>
                )}
            </CardContent>
            <CardFooter className="flex-col gap-4">
                 {isEditing ? (
                    <div className="flex w-full gap-4">
                        <Button type="button" variant="outline" onClick={() => {
                            form.reset({
                                name: userProfile?.name || user?.displayName || '',
                                title: userProfile?.title || '',
                                bio: userProfile?.bio || '',
                            });
                            setIsEditing(false);
                        }} className="w-full">Cancel</Button>
                        <Button type="submit" disabled={form.formState.isSubmitting} className="w-full">
                         {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Changes
                        </Button>
                    </div>
                ) : (
                    <Button type="button" onClick={() => setIsEditing(true)} variant="outline" className="w-full">
                        <Edit />
                        Edit Profile
                    </Button>
                )}

                <div className="border-t pt-6 w-full mt-2">
                    <Button onClick={signOutUser} variant="ghost" className="w-full text-destructive hover:text-destructive hover:bg-destructive/10">
                        <LogOut />
                        Sign Out
                    </Button>
                </div>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
}
