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
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useFailModal } from "../store/use-fail-modal";

export const FailModal = () => {
  const router = useRouter();
  const { isOpen, onClose } = useFailModal();

  const handleClose = () => {
    router.replace("/");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader className="flex items-center justify-center">
          <Image src="/logo.svg" alt="Logo" width={36} height={36} />
          <DialogTitle className="text-center">
            Something went wrong
          </DialogTitle>
          <DialogDescription>
            We could not process your payment
          </DialogDescription>
        </DialogHeader>
        <Separator />

        <DialogFooter className="pt-2 mt-4 gap-y-2">
          <Button className="w-full" onClick={handleClose} disabled={false}>
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
