import { FEATURES, PLANS } from "@/lib/billing/plans";
import { openBillingPortal } from "@/lib/utils";
import { useAuth } from "@clerk/expo";
import * as WebBrowser from "expo-web-browser";

export interface BillingState {
  isLoaded: boolean;
  isPro: boolean;
  hasUnlimitedEvents: boolean;
  hasEventBoost: boolean;
  hasVerifiedBadge: boolean;
  hasBasicEventsLimit: boolean;
  hasStandardVisibility: boolean;
  hasBasicHostProfile: boolean;
  hasP2PMessaging: boolean;
  openBillingPortal: () => Promise<WebBrowser.WebBrowserResult>;
}

export const useBilling = (): BillingState => {
  const { has, isLoaded } = useAuth();

  const isPro = Boolean(has?.({ plan: PLANS.pro }));

  return {
    isLoaded: Boolean(isLoaded),
    isPro,
    hasUnlimitedEvents: Boolean(has?.({ feature: FEATURES.unlimitedEvents })),
    hasEventBoost: Boolean(has?.({ feature: FEATURES.eventBoost })),
    hasVerifiedBadge: Boolean(has?.({ feature: FEATURES.verifiedBadge })),
    hasBasicEventsLimit: Boolean(has?.({ feature: FEATURES.basicEventsLimit })),
    hasStandardVisibility: Boolean(has?.({ feature: FEATURES.standardVisibility })),
    hasBasicHostProfile: Boolean(has?.({ feature: FEATURES.basicHostProfile })),
    hasP2PMessaging: Boolean(has?.({ feature: FEATURES.p2pMessaging })),
    openBillingPortal,
  };
};

