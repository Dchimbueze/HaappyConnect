import { notFound } from 'next/navigation';
import { Mic, MicOff, PhoneOff, Video, VideoOff, MessageSquare } from 'lucide-react';

import { experts } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';

export default function CallPage({ params }: { params: { id: string } }) {
  const expert = experts.find((e) => e.id === params.id);

  if (!expert) {
    notFound();
  }

  return (
    <div className="relative flex h-[calc(100vh-4rem)] w-full flex-col items-center justify-center bg-gray-900 text-white">
      {/* Remote Video */}
      <div className="relative h-full w-full">
        <div className="flex h-full w-full items-center justify-center bg-black">
          <div className="flex flex-col items-center gap-4">
            <Avatar className="h-32 w-32 border-4 border-gray-700">
              <AvatarImage src={expert.avatarUrl} alt={expert.name} data-ai-hint="person portrait" />
              <AvatarFallback className="text-4xl">{expert.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <p className="text-xl font-semibold">Connecting to {expert.name}...</p>
            <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                <p className="text-sm text-gray-400">Connection is secure</p>
            </div>
          </div>
        </div>
        <div className="absolute top-4 left-4 text-white">
          <p className="font-bold">{expert.name}</p>
          <p className="text-sm">{expert.title}</p>
        </div>
      </div>

      {/* Local Video */}
      <div className="absolute bottom-24 right-4 h-32 w-48 rounded-lg bg-black border-2 border-gray-600 shadow-lg md:h-40 md:w-64">
        <div className="flex h-full w-full items-center justify-center">
          <p className="text-sm text-gray-400">Your Video</p>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-center bg-black/30 p-4">
        <div className="flex items-center space-x-4 rounded-full bg-gray-800/80 p-3">
          <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full bg-gray-700/50 hover:bg-gray-700">
            <Mic className="h-6 w-6" />
          </Button>
          <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full bg-gray-700/50 hover:bg-gray-700">
            <Video className="h-6 w-6" />
          </Button>
          <Button asChild variant="destructive" size="icon" className="h-14 w-14 rounded-full">
            <Link href={`/expert/${expert.id}`}>
              <PhoneOff className="h-7 w-7" />
            </Link>
          </Button>
          <Button asChild variant="ghost" size="icon" className="h-12 w-12 rounded-full bg-gray-700/50 hover:bg-gray-700">
             <Link href={`/chat/${expert.id}`}>
                <MessageSquare className="h-6 w-6" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
