"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CreditCard, Loader, LogOut } from "lucide-react";
import { signOut, useSession } from "next-auth/react";

export const UserButton = () => {
  const session = useSession();

  if (session.status === "loading") {
    return <Loader className="size-4 text-muted-foreground animate-spin" />;
  }

  if (session.status === "unauthenticated" || !session.data) {
    return null;
  }
  const name = session.data?.user?.name;
  const imageUrl = session.data?.user?.image;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar className="size-10 hover:opacity-75 transition">
          <AvatarImage src={imageUrl || ""} alt={name || ""} />
          <AvatarFallback className="bg-blue-500 font-medium text-white">
            {name?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => {}} disabled={false} className="h-10">
          <CreditCard className="size-4 mr-2" />
          Billing
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => signOut()} disabled={false}>
          <LogOut className="size-4 mr-2" /> Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
