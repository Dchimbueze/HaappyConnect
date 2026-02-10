
'use client';

import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, UserCheck } from 'lucide-react';

type RoleStepProps = {
  onSelectRole: (role: 'seeker' | 'expert') => void;
};

export default function RoleStep({ onSelectRole }: RoleStepProps) {
  return (
    <div className="space-y-6 text-center">
        <p className="text-muted-foreground">First, tell us what you're here to do on HaappyConnect.</p>
        <div className="grid md:grid-cols-2 gap-6">
            <Card
                className="cursor-pointer hover:border-primary hover:shadow-lg transition-all"
                onClick={() => onSelectRole('seeker')}
            >
                <CardHeader className="items-center">
                    <div className="p-4 bg-primary/10 rounded-full mb-4">
                        <Search className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle>I'm a Seeker</CardTitle>
                    <CardDescription className="text-center">Find and connect with experts for advice and mentorship.</CardDescription>
                </CardHeader>
            </Card>
            <Card
                className="cursor-pointer hover:border-primary hover:shadow-lg transition-all"
                onClick={() => onSelectRole('expert')}
            >
                <CardHeader className="items-center">
                     <div className="p-4 bg-primary/10 rounded-full mb-4">
                        <UserCheck className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle>I'm an Expert</CardTitle>
                    <CardDescription className="text-center">Offer your expertise, build your brand, and earn money.</CardDescription>
                </CardHeader>
            </Card>
        </div>
        <p className="text-xs text-muted-foreground">You can change your role later in your settings.</p>
    </div>
  );
}
