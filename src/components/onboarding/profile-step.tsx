
'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { type User } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User as UserIcon } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { updateUserProfile } from '@/firebase/auth/auth-service';

type ProfileStepProps = {
  onNext: () => void;
  onPrev: () => void;
  isExpert: boolean;
  user: User | null;
};

export default function ProfileStep({ onNext, onPrev, isExpert, user }: ProfileStepProps) {
    const { toast } = useToast();

    const profileSchema = z.object({
        name: z.string().min(2, 'Name must be at least 2 characters.'),
        title: isExpert 
            ? z.string().min(2, 'Title must be at least 2 characters.') 
            : z.string().optional(),
        bio: z.string().max(300, 'Bio must be 300 characters or less.').optional(),
      });
      
    type ProfileFormValues = z.infer<typeof profileSchema>;

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.displayName || '',
      title: '',
      bio: '',
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
    };

    try {
        await updateUserProfile(user.uid, data);
        toast({
            title: "Profile Updated",
            description: "Your profile information has been saved.",
        });
        onNext();
    } catch (error) {
        console.error("Failed to update profile:", error);
        toast({
            variant: "destructive",
            title: "Update Failed",
            description: "Could not save your profile. Please try again.",
        });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <p className="text-muted-foreground">Let's set up your public profile. You can change this information later.</p>
      <div className="space-y-2">
        <Label>Profile Picture</Label>
        <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
                <AvatarImage src={user?.photoURL ?? undefined} data-ai-hint="placeholder avatar" />
                <AvatarFallback className="text-2xl">
                    {user?.displayName ? user.displayName.charAt(0).toUpperCase() : <UserIcon />}
                </AvatarFallback>
            </Avatar>
            <Button type="button" variant="outline" onClick={() => toast({ title: 'Coming Soon!', description: 'Photo uploads will be available soon.'})}>Upload Photo</Button>
        </div>
      </div>
      <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Jane Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {isExpert && (
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title / Headline</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Senior Software Engineer" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  id="bio"
                  placeholder="Tell us a little bit about yourself..."
                  rows={4}
                  {...field}
                />
              </FormControl>
               <FormMessage />
            </FormItem>
          )}
        />
      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onPrev}>
          Back
        </Button>
        <Button type="submit">{isExpert ? 'Next' : 'Finish Onboarding'}</Button>
      </div>
      </form>
    </Form>
  );
}
