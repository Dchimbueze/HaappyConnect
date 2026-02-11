
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PartyPopper } from 'lucide-react';
import Link from 'next/link';

type PayoutsStepProps = {
  onPrev: () => void;
};

export default function PayoutsStep({ onPrev }: PayoutsStepProps) {
  return (
    <div className="space-y-6 text-center">
        <div className="flex justify-center">
            <PartyPopper className="h-16 w-16 text-accent" />
        </div>
        <h2 className="text-2xl font-bold">You're all set!</h2>
        <p className="text-muted-foreground">
            Your expert profile is pending review. In the meantime, you can set up your payouts to receive payments from clients. We use Stripe for secure and reliable payments.
        </p>
      
        <Card className="text-left">
            <CardHeader>
                <CardTitle>Connect with Stripe</CardTitle>
                <CardDescription>Click the button below to connect your Stripe account. You will be redirected to Stripe to complete the process.</CardDescription>
            </CardHeader>
        </Card>

        <div className="flex flex-col gap-4">
            <Button asChild size="lg" className="bg-accent hover:bg-accent/90">
                <Link href="/browse">Connect with Stripe</Link>
            </Button>
            <Link href="/browse">
                <Button variant="ghost">I'll do this later</Button>
            </Link>
        </div>
        <div className="flex justify-start pt-4">
            <Button variant="outline" onClick={onPrev}>
                Back
            </Button>
        </div>
    </div>
  );
}
