import { FEATURES, PLANS } from "@/lib/billing/plans";
import { useAuth } from "@clerk/expo";

export const useBilling = () => {
  const { has, isLoaded } = useAuth();

  const isPro = has ? has({ plan: PLANS.pro }) : false;

  return {
    isLoaded,
    isPro,
    hasUnlimitedEvents: has
      ? has({ feature: FEATURES.unlimitedEvents })
      : false,
    hasEventBoost: has ? has({ feature: FEATURES.eventBoost }) : false,
    hasVerifiedBadge: has ? has({ feature: FEATURES.verifiedBadge }) : false,
  };
};
