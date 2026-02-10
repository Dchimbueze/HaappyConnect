
'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from 'lucide-react';

type ProfileStepProps = {
  onNext: () => void;
  onPrev: () => void;
  isExpert: boolean;
};

export default function ProfileStep({ onNext, onPrev, isExpert }: ProfileStepProps) {
  return (
    <div className="space-y-6">
        <p className="text-muted-foreground">Let's set up your public profile. You can change this information later.</p>
      <div className="space-y-2">
        <Label>Profile Picture</Label>
        <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
                <AvatarImage src="https://picsum.photos/seed/100/80/80" data-ai-hint="placeholder avatar" />
                <AvatarFallback className="text-2xl"><User/></AvatarFallback>
            </Avatar>
            <Button variant="outline">Upload Photo</Button>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input id="name" placeholder="e.g., Jane Doe" />
      </div>
      {isExpert && (
        <div className="space-y-2">
            <Label htmlFor="title">Title / Headline</Label>
            <Input id="title" placeholder="e.g., Senior Software Engineer" />
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          placeholder="Tell us a little bit about yourself..."
          rows={4}
        />
      </div>
      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev}>
          Back
        </Button>
        <Button onClick={onNext}>{isExpert ? 'Next' : 'Finish Onboarding'}</Button>
      </div>
    </div>
  );
}
