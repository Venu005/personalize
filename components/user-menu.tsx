"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/slices/userSlice";
import { User, Settings, LogOut, LogIn } from "lucide-react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
// Add this import
import { LanguageSwitcher } from "@/components/language-switcher";
import { useTranslation } from "react-i18next";

export function UserMenu() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.user);
  const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);
  const { data: session } = useSession();

  const handleLogout = async () => {
    // Sign out from NextAuth
    await signOut({ callbackUrl: "/auth/login" });

    // Clear user data from Redux store
    dispatch(logout());
  };

  if (!isAuthenticated || !user) {
    return (
      <Button variant="ghost" size="sm" asChild>
        <Link href="/auth/login">
          <LogIn className="h-4 w-4 mr-2" />
          Login
        </Link>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>
              {user.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile">
            <User className="mr-2 h-4 w-4" />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <div className="px-2 py-1.5">
          <LanguageSwitcher />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
