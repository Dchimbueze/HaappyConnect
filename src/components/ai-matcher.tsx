'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { useEffect, useRef } from 'react';
import Link from 'next/link';

import { findExpertsAction } from '@/app/actions';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Bot, AlertCircle, Search } from 'lucide-react';
import { type AIMatcherState } from '@/lib/types';
import { experts } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full bg-accent hover:bg-accent/90">
      {pending ? (
        <>
          <Bot className="mr-2 h-4 w-4 animate-spin" />
          Finding Matches...
        </>
      ) : (
        <>
          <Sparkles className="mr-2 h-4 w-4" />
          Find My Expert
        </>
      )}
    </Button>
  );
}

export default function AiMatcher() {
  const initialState: AIMatcherState = {};
  const [state, formAction] = useFormState(findExpertsAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state.suggestions || state.error) {
      formRef.current?.reset();
      // Scroll to results after a short delay to allow DOM update
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [state.timestamp]); // Use timestamp to detect new submissions

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardContent className="p-6">
          <form ref={formRef} action={formAction} className="space-y-4">
            <Textarea
              name="requirements"
              placeholder="e.g., 'I need help building a mobile app with React Native and connecting it to a Firebase backend. I'm looking for someone with experience in e-commerce.'"
              rows={5}
              required
              minLength={10}
              className="focus-visible:ring-accent"
            />
            <SubmitButton />
          </form>
        </CardContent>
      </Card>
      
      <div ref={resultsRef}>
        {state.error && (
            <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{state.error}</AlertDescription>
            </Alert>
        )}

        {state.suggestions && (
          <div className="mt-4">
            <h3 className="font-headline text-2xl font-bold mb-4 flex items-center">
              <Sparkles className="mr-2 h-5 w-5 text-accent" /> AI Suggestions
            </h3>
            {state.suggestions.length > 0 ? (
              <div className="space-y-4">
                {state.suggestions.map((suggestion) => {
                  const expert = experts.find(e => e.id === suggestion.expertId);
                  if (!expert) return null;
                  return (
                    <Card key={suggestion.expertId} className="overflow-hidden transition-all hover:shadow-md">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <Avatar className="h-12 w-12 border">
                            <AvatarImage src={expert.avatarUrl} alt={expert.name} data-ai-hint="person portrait" />
                            <AvatarFallback>{expert.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle className="text-lg font-headline">{expert.name}</CardTitle>
                                <p className="text-sm text-muted-foreground">{expert.title}</p>
                              </div>
                              <Badge variant={suggestion.matchScore > 0.8 ? "default" : "secondary"} className={suggestion.matchScore > 0.8 ? "bg-accent text-accent-foreground" : ""}>
                                Match: {Math.round(suggestion.matchScore * 100)}%
                              </Badge>
                            </div>
                            <p className="mt-2 text-sm text-foreground/80 italic border-l-2 border-accent pl-3">"{suggestion.reason}"</p>
                            <Button asChild size="sm" className="mt-3">
                              <Link href={`/expert/${expert.id}`}>View Profile</Link>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            ) : (
                <Alert>
                    <Search className="h-4 w-4" />
                    <AlertTitle>No Matches Found</AlertTitle>
                    <AlertDescription>We couldn't find any experts that match your criteria. Please try refining your request.</AlertDescription>
                </Alert>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
