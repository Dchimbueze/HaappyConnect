import { experts } from '@/lib/data';
import ExpertCard from '@/components/expert-card';
import AiMatcher from '@/components/ai-matcher';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search } from 'lucide-react';

export default function Home() {
  const categories = [...new Set(experts.map((e) => e.category))];

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-12 rounded-xl bg-card p-8 shadow-sm">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="flex flex-col justify-center">
            <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground md:text-5xl">
              Connect with Your Ideal Expert
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Describe your needs and let our AI find the perfect match for you
              from our community of trusted professionals.
            </p>
          </div>
          <AiMatcher />
        </div>
      </section>

      <section>
        <h2 className="font-headline text-3xl font-bold tracking-tight">
          Browse Experts
        </h2>
        <div className="mt-6 mb-8 flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search by skill (e.g., React, Fundraising)"
              className="pl-10"
            />
          </div>
          <Select>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {experts.map((expert) => (
            <ExpertCard key={expert.id} expert={expert} />
          ))}
        </div>
      </section>
    </div>
  );
}
