import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Paperclip, Send, Video } from 'lucide-react';
import { experts } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ChatPage({ params }: { params: { id: string } }) {
  const expert = experts.find((e) => e.id === params.id);

  if (!expert) {
    notFound();
  }

  const messages = [
    { from: 'expert', text: `Hi there! I'm ${expert.name}. How can I help you today?` },
    { from: 'user', text: 'Hi! I saw your profile and I\'m interested in your Pitch Deck Review service.' },
    { from: 'expert', text: 'Great! I\'d be happy to help. Feel free to upload your deck whenever you\'re ready, or we can discuss your needs first.' },
  ];

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col bg-muted/20">
      {/* Chat Header */}
      <header className="flex items-center gap-4 border-b bg-card p-4">
        <Button asChild variant="ghost" size="icon" className="md:hidden">
          <Link href={`/expert/${expert.id}`}>
            <ArrowLeft />
          </Link>
        </Button>
        <Avatar>
          <AvatarImage src={expert.avatarUrl} alt={expert.name} data-ai-hint="person portrait" />
          <AvatarFallback>{expert.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="font-semibold">{expert.name}</p>
          <p className="text-sm text-muted-foreground">{expert.title}</p>
        </div>
        <Button asChild variant="outline">
          <Link href={`/call/${expert.id}`}>
            <Video className="mr-2 h-4 w-4" />
            Start Call
          </Link>
        </Button>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-4xl space-y-6">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex items-end gap-2 ${
                message.from === 'user' ? 'justify-end' : ''
              }`}
            >
              {message.from === 'expert' && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src={expert.avatarUrl} alt={expert.name} />
                  <AvatarFallback>{expert.name.charAt(0)}</AvatarFallback>
                </Avatar>
              )}
              <div
                className={`max-w-md rounded-lg p-3 ${
                  message.from === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card shadow-sm'
                }`}
              >
                <p>{message.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Message Input */}
      <footer className="border-t bg-card p-4">
        <div className="mx-auto max-w-4xl">
          <div className="relative">
            <Input
              placeholder="Type your message..."
              className="pr-24"
            />
            <div className="absolute right-2 top-1/2 flex -translate-y-1/2 gap-1">
              <Button variant="ghost" size="icon">
                <Paperclip className="h-5 w-5" />
              </Button>
              <Button>
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
