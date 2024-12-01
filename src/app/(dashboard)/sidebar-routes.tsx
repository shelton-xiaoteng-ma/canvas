"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useBilling } from "@/features/subscriptions/api/use-billing";
import { usePaywall } from "@/features/subscriptions/hooks/use-paywall";
import {
  CreditCard,
  Crown,
  HomeIcon,
  MessageCircleQuestion,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { SidebarItem } from "./sidebar-item";

export const SidebarRoutes = () => {
  const pathname = usePathname();
  const billingMutation = useBilling();
  const { isLoading, shouldBlock, triggerPaywall } = usePaywall();

  const onClickBilling = () => {
    if (shouldBlock) {
      triggerPaywall();
      return;
    }
    billingMutation.mutate();
  };

  return (
    <div className="flex flex-col gap-y-4 flex-1">
      {shouldBlock && !isLoading && (
        <>
          <div className="px-4">
            <Button
              onClick={() => {
                triggerPaywall();
              }}
              className="w-full rounded-xl border-none hover:bg-white hover:opacity-75 transition"
              variant="outline"
              size="lg"
              disabled={isLoading}
            >
              <Crown className="mr-2 size-4 fill-yellow-500 text-yellow-500" />
              Upgrade to Pro
            </Button>
          </div>
          <div className="px-3">
            <Separator />
          </div>
        </>
      )}
      <ul className="flex flex-col gap-y-1 px-3">
        <SidebarItem
          href="/"
          label="Home"
          icon={HomeIcon}
          isActive={pathname === "/"}
        />
      </ul>
      <div className="px-3">
        <Separator />
      </div>
      <ul className="flex flex-col gap-y-1 px-3">
        <SidebarItem
          href={pathname}
          label="Billing"
          icon={CreditCard}
          onClick={onClickBilling}
        />
        <SidebarItem
          href="mailto:support@mail.com"
          label="Get Help"
          icon={MessageCircleQuestion}
          onClick={() => {}}
        />
      </ul>
    </div>
  );
};
