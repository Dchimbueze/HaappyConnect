
'use client';

import Link from 'next/link';
import {
  Briefcase,
  LayoutDashboard,
  LifeBuoy,
  LogIn,
  LogOut,
  Settings,
  User,
  UserPlus,
  Search,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useUser } from '@/firebase';
import { signOutUser } from '@/firebase/auth/auth-service';
import { useRouter } from 'next/navigation';

export default function Header() {
  const { user, loading } = useUser();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOutUser();
    router.push('/');
  };

  const isAuthenticated = !!user;

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-card">
      <div className="container mx-auto flex h-16 items-center space-x-4 px-4 sm:justify-between sm:space-x-0">
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <Briefcase className="h-6 w-6 text-primary" />
            <span className="font-headline text-2xl font-bold">
              HaappyConnect
            </span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            {loading && (
              <Skeleton className="h-8 w-8 rounded-full" />
            )}
            {!loading && isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      {user.photoURL && <AvatarImage
                        src={user.photoURL}
                        alt={user.displayName || 'User'}
                        data-ai-hint="user avatar"
                      />}
                      <AvatarFallback>
                        {user.displayName
                          ? user.displayName.split(' ').map((n) => n[0]).join('')
                          : 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.displayName}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <Link href="/browse">
                        <DropdownMenuItem>
                            <Search />
                            Browse Experts
                        </DropdownMenuItem>
                    </Link>
                    <Link href="/admin">
                      <DropdownMenuItem>
                        <LayoutDashboard />
                        Admin Dashboard
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem>
                      <User />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings />
                      Settings
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <LifeBuoy />
                    Support
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : !loading && !isAuthenticated && (
                <div className="flex items-center gap-2">
                    <Button asChild variant="ghost">
                        <Link href="/auth/login">
                           <LogIn />
                           Log In
                        </Link>
                    </Button>
                    <Button asChild>
                        <Link href="/auth/signup">
                           <UserPlus />
                           Sign Up
                        </Link>
                    </Button>
                </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
