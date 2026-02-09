import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Star, MessageSquare, Video, Clock } from 'lucide-react';
import { experts } from '@/lib/data';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';

export default function ExpertPage({ params }: { params: { id: string } }) {
  const expert = experts.find((e) => e.id === params.id);

  if (!expert) {
    notFound();
  }

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Left column for profile summary */}
        <div className="md:col-span-1">
          <Card className="sticky top-24 shadow-lg">
            <CardHeader className="items-center text-center">
              <Avatar className="h-32 w-32 border-4 border-primary">
                <AvatarImage src={expert.avatarUrl} alt={expert.name} data-ai-hint="person portrait" />
                <AvatarFallback className="text-4xl">{expert.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <CardTitle className="pt-4 font-headline text-2xl">
                {expert.name}
              </CardTitle>
              <CardDescription>{expert.title}</CardDescription>
              <div className="flex items-center gap-2 pt-2">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-accent text-accent" />
                  <span className="text-lg font-bold">{expert.rating.toFixed(1)}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  ({expert.reviewsCount} reviews)
                </span>
              </div>
            </CardHeader>
            <CardContent className="text-center">
                <Button size="lg" className="w-full mb-4">
                  <MessageSquare className="mr-2 h-4 w-4" /> Start Chat
                </Button>
                <p className="flex items-center justify-center text-sm text-muted-foreground">
                  <Clock className="mr-2 h-4 w-4" />
                  Response time: {expert.responseTime}
                </p>
            </CardContent>
          </Card>
        </div>

        {/* Right column for details */}
        <div className="md:col-span-2">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="font-headline">About {expert.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{expert.bio}</p>
              <h4 className="mt-6 mb-3 font-semibold">Skills</h4>
              <div className="flex flex-wrap gap-2">
                {expert.skills.map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="services">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="services" className="mt-4">
              <div className="space-y-4">
                <h3 className="font-headline text-xl font-bold">Tiered Engagements</h3>
                {expert.tiers.map((tier) => (
                  <Card key={tier.id} className="transition-all hover:shadow-md">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{tier.title}</CardTitle>
                        <span className="text-xl font-bold text-primary">
                          ${tier.price}
                        </span>
                      </div>
                      <CardDescription>{tier.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button className="w-full bg-accent hover:bg-accent/90">
                        <Video className="mr-2 h-4 w-4" /> Book Now
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="mt-4">
               <h3 className="font-headline text-xl font-bold mb-4">What people are saying</h3>
              {expert.reviews.length > 0 ? (
                <div className="space-y-6">
                  {expert.reviews.map((review) => (
                    <div key={review.id} className="flex items-start gap-4">
                      <Avatar>
                        <AvatarImage src={review.avatarUrl} alt={review.author} data-ai-hint="person avatar" />
                        <AvatarFallback>{review.author.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{review.author}</p>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating
                                    ? 'fill-accent text-accent'
                                    : 'fill-muted text-muted-foreground'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="mt-1 text-muted-foreground">
                          {review.comment}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No reviews yet.</p>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
