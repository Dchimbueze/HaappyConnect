import Link from 'next/link';
import Image from 'next/image';
import { Star } from 'lucide-react';

import { type Expert } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

type ExpertCardProps = {
  expert: Expert;
};

export default function ExpertCard({ expert }: ExpertCardProps) {
  return (
    <Card className="flex h-full flex-col overflow-hidden transition-shadow duration-300 hover:shadow-lg">
      <CardHeader className="flex-row items-start gap-4">
        <Avatar className="h-16 w-16 border">
          <AvatarImage src={expert.avatarUrl} alt={expert.name} data-ai-hint="person portrait" />
          <AvatarFallback>{expert.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <CardTitle className="font-headline text-xl">{expert.name}</CardTitle>
          <CardDescription>{expert.title}</CardDescription>
          <div className="mt-2 flex items-center gap-1">
            <Star className="h-4 w-4 fill-accent text-accent" />
            <span className="font-semibold">{expert.rating.toFixed(1)}</span>
            <span className="text-sm text-muted-foreground">
              ({expert.reviewsCount} reviews)
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex flex-wrap gap-2">
          {expert.skills.slice(0, 3).map((skill) => (
            <Badge key={skill} variant="secondary">
              {skill}
            </Badge>
          ))}
          {expert.skills.length > 3 && (
            <Badge variant="outline">+{expert.skills.length - 3} more</Badge>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full" variant="outline">
          <Link href={`/expert/${expert.id}`}>View Profile</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
