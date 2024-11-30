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
import { useSubscriptionModal } from "../store/use-subscription-modal";

export const SubscriptionModal = () => {
  const { isOpen, onClose, onOpen } = useSubscriptionModal();
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
          <Button className="w-full" onClick={() => {}} disabled={false}>
            Upgrade
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};