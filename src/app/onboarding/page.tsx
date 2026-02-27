
'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import RoleStep from '@/components/onboarding/role-step';
import ProfileStep from '@/components/onboarding/profile-step';
import CategoryStep from '@/components/onboarding/category-step';
import VerificationStep from '@/components/onboarding/verification-step';
import PayoutsStep from '@/components/onboarding/payouts-step';
import { useUser } from '@/firebase';
import { updateUserProfile } from '@/firebase/auth/auth-service';
import { Skeleton } from '@/components/ui/skeleton';

type UserRole = 'seeker' | 'expert' | 'dual' | null;

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<UserRole>(null);
  const { user, loading } = useUser();

  const expertSteps = [
    { id: 1, name: 'Select Role' },
    { id: 2, name: 'Profile Information' },
    { id: 3, name: 'Expertise' },
    { id: 4, name: 'Verification' },
    { id: 5, name: 'Payouts' },
  ];

  const seekerSteps = [
    { id: 1, name: 'Select Role' },
    { id: 2, name: 'Profile Information' },
  ];
  
  const isExpertFlow = role === 'expert' || role === 'dual';
  const steps = isExpertFlow ? expertSteps : seekerSteps;
  const totalSteps = steps.length;

  const nextStep = () => {
    if (!isExpertFlow && step === 2) {
        window.location.href = '/browse';
        return;
    }
    setStep((s) => Math.min(s + 1, totalSteps));
  };
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));
  
  const selectRole = (selectedRole: UserRole) => {
    if (user && selectedRole) {
      updateUserProfile(user.uid, { role: selectedRole });
    }
    setRole(selectedRole);
    nextStep();
  };

  if (loading) {
    return (
      <div className="container mx-auto flex max-w-3xl flex-col items-center justify-center p-4 py-12">
        <Card className="w-full">
          <CardHeader>
            <Skeleton className="h-8 w-1/2 mb-6" />
            <Skeleton className="h-10 w-1/3" />
            <Skeleton className="h-4 w-1/4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-48 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto flex max-w-3xl flex-col items-center justify-center p-4 py-12">
      <Card className="w-full">
        <CardHeader>
          <div className="mb-6">
            <ol className="flex items-center w-full">
              {steps.map((s, index) => (
                <li
                  key={s.id}
                  className={cn(
                    "flex w-full items-center",
                    index < steps.length - 1 ? "after:content-[''] after:w-full after:h-1 after:border-b after:border-border after:border-4 after:inline-block" : "",
                    index < step ? 'after:border-primary' : 'after:border-muted',
                  )}
                >
                  <span
                    className={cn(
                      "flex items-center justify-center w-10 h-10 rounded-full lg:h-12 lg:w-12 shrink-0",
                      index < step ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                    )}
                  >
                    {s.id}
                  </span>
                </li>
              ))}
            </ol>
          </div>
          <CardTitle className="text-3xl font-bold font-headline">{steps[step - 1].name}</CardTitle>
          <CardDescription>Step {step} of {totalSteps}</CardDescription>
        </CardHeader>
        <CardContent>
          {step === 1 && <RoleStep onSelectRole={selectRole} />}
          {step === 2 && <ProfileStep onNext={nextStep} onPrev={prevStep} isExpert={isExpertFlow} user={user} />}
          {isExpertFlow && step === 3 && <CategoryStep onNext={nextStep} onPrev={prevStep} />}
          {isExpertFlow && step === 4 && <VerificationStep onNext={nextStep} onPrev={prevStep} />}
          {isExpertFlow && step === 5 && <PayoutsStep onPrev={prevStep} />}
        </CardContent>
      </Card>
    </div>
  );
}
