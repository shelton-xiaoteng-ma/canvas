import { useGetSubscription } from "../api/use-get-subscription";
import { useSubscriptionModal } from "../store/use-subscription-modal";

export const usePaywall = () => {
  const subscriptionModal = useSubscriptionModal();

  const { data: subscription, isLoading: isLoadingSubscription } =
    useGetSubscription();

  const shouldBlock = !subscription?.active || isLoadingSubscription;

  return {
    isLoading: isLoadingSubscription,
    shouldBlock,
    triggerPaywall: () => {
      subscriptionModal.onOpen();
    },
  };
};
