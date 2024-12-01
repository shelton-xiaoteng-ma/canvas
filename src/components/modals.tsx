"use client";

import { FailModal } from "@/features/subscriptions/components/fail-modal";
import { SubscriptionModal } from "@/features/subscriptions/components/subscription-modal";
import { SuccessModal } from "@/features/subscriptions/components/success-modal";
import { useEffect, useState } from "react";

export const Modals = () => {
  const [isMounted, setIsMounted] = useState(false);

  // useEffect can only run on the client's side, means during server side rendering this modal's component will not even exist.
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <SubscriptionModal />
      <FailModal />
      <SuccessModal />
    </>
  );
};
