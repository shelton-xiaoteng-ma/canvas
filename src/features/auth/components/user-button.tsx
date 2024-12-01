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
import { useBilling } from "@/features/subscriptions/api/use-billing";
import { usePaywall } from "@/features/subscriptions/hooks/use-paywall";
import { CreditCard, Crown, Loader, LogOut } from "lucide-react";
import { signOut, useSession } from "next-auth/react";

export const UserButton = () => {
  const session = useSession();
  const mutation = useBilling();
  const { isLoading, shouldBlock, triggerPaywall } = usePaywall();

  const onClickBilling = () => {
    if (shouldBlock) {
      triggerPaywall();
      return;
    }
    mutation.mutate();
  };

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
      <DropdownMenuTrigger className="outline-none relative">
        {!shouldBlock && !isLoading && (
          <div className="absolute -top-1 -left-1 z-10 flex items-center justify-center">
            <div className="rounded-full bg-white flex items-center justify-center p-1 drop-shadow-sm">
              <Crown className=" fill-yellow-500 text-yellow-500  size-3" />
            </div>
          </div>
        )}
        <Avatar className="size-10 hover:opacity-75 transition">
          <AvatarImage src={imageUrl || ""} alt={name || ""} />
          <AvatarFallback className="bg-blue-500 font-medium text-white">
            {name?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        {isLoading && (
          <div>
            <Loader className="size-6 animate-spin text-muted-foreground" />
          </div>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={onClickBilling}
          disabled={mutation.isPending}
          className="h-10"
        >
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
