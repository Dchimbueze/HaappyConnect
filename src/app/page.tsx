
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Search, UserCheck, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { experts } from '@/lib/data';
import ExpertCard from '@/components/expert-card';

export default function LandingPage() {
  const features = [
    {
      icon: <Search className="h-8 w-8 text-primary" />,
      title: 'Find Your Expert',
      description: 'Use our AI-powered search or browse categories to find the perfect expert for your needs.',
    },
    {
      icon: <UserCheck className="h-8 w-8 text-primary" />,
      title: 'Connect Instantly',
      description: 'Chat, call, or book a session directly through the platform. Secure and seamless communication.',
    },
    {
      icon: <Briefcase className="h-8 w-8 text-primary" />,
      title: 'Offer Your Expertise',
      description: 'Join our community of experts, share your knowledge, and build your own consulting business.',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-card">
          <div className="container mx-auto grid max-w-screen-xl px-4 py-8 lg:grid-cols-12 lg:gap-8 lg:py-16 xl:gap-0">
            <div className="mr-auto place-self-center lg:col-span-7">
              <h1 className="mb-4 max-w-2xl font-headline text-4xl font-extrabold leading-none tracking-tight md:text-5xl xl:text-6xl">
                Unlock Your Potential.
                <br />
                Connect with Experts.
              </h1>
              <p className="mb-6 max-w-2xl text-muted-foreground md:text-lg lg:mb-8 lg:text-xl">
                HappyConnect is a two-sided marketplace connecting advice-seekers with vetted experts for on-demand consultations.
              </p>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                 <Button asChild size="lg">
                  <Link href="/browse">
                    Find an Expert <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/onboarding">
                    Become an Expert
                  </Link>
                </Button>
              </div>
            </div>
            <div className="hidden lg:col-span-5 lg:mt-0 lg:flex">
              <Image
                src="https://picsum.photos/seed/professionals/600/600"
                alt="Happy people collaborating"
                width={600}
                height={600}
                className="rounded-lg object-cover shadow-lg"
                data-ai-hint="professional people working"
              />
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section id="features" className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="font-headline text-3xl font-bold">How It Works</h2>
              <p className="text-muted-foreground mt-2">Get started in three simple steps.</p>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {features.map((feature, index) => (
                <Card key={index} className="text-center border-0 shadow-none bg-transparent">
                  <CardHeader>
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                      {feature.icon}
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Experts Section */}
        <section className="py-16 lg:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-center font-headline text-3xl font-bold mb-10">
              Meet Our Top Experts
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {experts.slice(0, 4).map((expert) => (
                <ExpertCard key={expert.id} expert={expert} />
              ))}
            </div>
             <div className="text-center mt-12">
                <Button asChild size="lg" variant="outline">
                    <Link href="/browse">
                        View All Experts <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                </Button>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="bg-card">
          <div className="container mx-auto px-4 py-16 text-center">
            <h2 className="font-headline text-3xl font-bold">Ready to Get Started?</h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Join thousands of users who are accelerating their growth and sharing their knowledge on HappyConnect.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Button asChild size="lg">
                  <Link href="/auth/signup">Sign Up for Free</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="bg-muted/30 border-t">
        <div className="container mx-auto py-6 px-4 text-center text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} HappyConnect. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
