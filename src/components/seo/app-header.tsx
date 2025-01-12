import { LogOut, Search, User } from 'lucide-react';

import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ModeToggle } from '@/features/theme/mode-toggle';
import { useAuth } from '@/hooks';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { getInitials } from '@/lib/utils';

export const AppHeader = () => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-14 justify-between items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto ̰ sm:border-0 sm:bg-transparent sm:px-6">
      <div className="relative ml-auto flex-1 md:grow-0">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search..."
          className="w-full rounded-xl bg-background pl-8 md:w-[200px] lg:w-[336px]"
        />
      </div>
      <div className="flex justify-end gap-3">
        <ModeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="rounded-full border border-zinc-300"
              asChild
            >
              <Avatar className="cursor-pointer">
                <AvatarFallback>
                  {user ? getInitials(user.name) : '?'}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-36"
            align="end"
          >
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
                {/* <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut> */}
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
              {/* <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut> */}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
