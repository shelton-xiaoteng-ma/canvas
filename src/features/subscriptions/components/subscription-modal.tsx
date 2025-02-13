"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { useCheckout } from "../api/use-checkout";
import { useIssueModal } from "../store/use-issue-modal";
import { useSubscriptionModal } from "../store/use-subscription-modal";

export const SubscriptionModal = () => {
  const { isOpen, onClose } = useSubscriptionModal();
  const { open: openIssueModal } = useIssueModal();

  const isStripeEnabled = process.env.STRIPE_ENABLED === "true";

  const mutation = useCheckout();

  // Function to handle the subscription process
  // If Stripe is enabled, it creates a checkout session
  // Otherwise, it opens an issue modal
  const onClick = async () => {
    // If the user is already on a pro plan, redirect them to the subscription management page
    if (!isStripeEnabled) {
      openIssueModal();
    } else {
      mutation.mutate();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader className="flex items-center justify-center">
          <Image src="/logo.svg" alt="Logo" width={36} height={36} />
          <DialogTitle className="text-center">
            Upgrade to a paid plan
          </DialogTitle>
          <DialogDescription>
            Upgrade to a paid plan to unlock more features
          </DialogDescription>
        </DialogHeader>
        <Separator />
        <ul className="space-y-2">
          <li className="flex items-center">
            <CheckCircle2 className="size-5 mr-2 fill-blue-500 text-white" />
            <p className="text-sm text-muted-foreground">Unlimited projects</p>
          </li>
          <li className="flex items-center">
            <CheckCircle2 className="size-5 mr-2 fill-blue-500 text-white" />
            <p className="text-sm text-muted-foreground">Unlimited templates</p>
          </li>
          <li className="flex items-center">
            <CheckCircle2 className="size-5 mr-2 fill-blue-500 text-white" />
            <p className="text-sm text-muted-foreground">
              AI Background removal
            </p>
          </li>
          <li className="flex items-center">
            <CheckCircle2 className="size-5 mr-2 fill-blue-500 text-white" />
            <p className="text-sm text-muted-foreground">AI image generation</p>
          </li>
        </ul>
        <DialogFooter className="pt-2 mt-4 gap-y-2">
          <Button
            className="w-full"
            onClick={onClick}
            disabled={mutation.isPending}
          >
            Upgrade
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
