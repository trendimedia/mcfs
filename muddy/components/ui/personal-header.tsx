'use client';

import { Bell, User, Calendar, Moon, Sun, BroomSparkles, CheckCircle2, Clock3 } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { logout } from '@/app/actions/auth';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

const sampleNotifications = [
  {
    id: '1',
    title: 'No notifications yet',
    message: 'New sign-ins and submissions will appear here in reverse chronological order.',
    type: 'system',
    createdAt: new Date().toISOString(),
  },
];

const formatDate = () =>
  new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

export default function Header() {
  const [mounted, setMounted] = useState(false);
  const [currentDate, setCurrentDate] = useState('');
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    setCurrentDate(formatDate());
  }, []);

  const handleLogout = async () => {
    await logout();
  };

  const openProfile = () => {
    router.push('/profile');
  };

  const notifications = sampleNotifications;

  return (
    <header className="bg-background/80 fixed top-0 left-0 z-50 w-full border-b backdrop-blur-md">
      <div className="flex w-full items-center justify-between px-3 py-3 md:px-6">
        <div className="m-auto flex w-full items-center justify-center text-center">
          <div className="text-muted-foreground hidden w-full items-center gap-2 text-xs md:flex md:text-sm">
            <Calendar className="size-4" />
            <span>{currentDate || 'Loading…'}</span>
          </div>
          <div className={cn('m-auto flex w-full items-center justify-center gap-1.5 text-center md:hidden')}>
            <BroomSparkles className="text-primary" />
            <h1 className="text-xl font-medium">MCFS</h1>
          </div>
          <div className="block w-auto md:hidden">
            <Button
              size="icon"
              className="!bg-primary rounded-sm text-white hover:!bg-rose-600"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label="Toggle theme"
            >
              {mounted && theme === 'dark' ? <Sun className="size-5" /> : <Moon className="size-5" />}
            </Button>
          </div>
        </div>
        <div className="ml-auto hidden w-auto items-center justify-end gap-2 md:flex md:w-full md:max-w-xs">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="outline" size="icon" className="relative rounded-sm" type="button">
                <Bell className="size-5" />
                <span className="bg-primary absolute -top-1 -right-1 size-3 rounded-full border border-white" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 rounded-sm p-2">
              <div className="mb-2 px-2 py-1 text-sm font-semibold">Notifications</div>
              {notifications
                .slice()
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .map((item) => (
                  <DropdownMenuItem key={item.id} className="flex cursor-default flex-col items-start gap-1 rounded-sm p-3 hover:!bg-muted/60">
                    <div className="flex w-full items-center justify-between gap-2">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        {item.type === 'login' ? <CheckCircle2 className="size-4 text-emerald-600" /> : <Clock3 className="size-4 text-primary" />}
                        <span>{item.title}</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">{item.message}</p>
                    <span className="text-[10px] text-muted-foreground">
                      {new Date(item.createdAt).toLocaleString()}
                    </span>
                  </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="outline" size="icon" className="relative rounded-sm" type="button">
                <User className="size-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-sm">
              <DropdownMenuItem onClick={openProfile} className="hover:!bg-primary rounded hover:!text-white">
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout} className="hover:!bg-primary rounded hover:!text-white">
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="outline"
            size="icon"
            className="rounded-sm"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label="Toggle theme"
          >
            {mounted && theme === 'dark' ? <Sun className="size-5" /> : <Moon className="size-5" />}
          </Button>
        </div>
      </div>
    </header>
  );
}