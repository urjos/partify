export const PLANS = {
  free: "user:free",
  pro: "user:pro",
} as const;

export const FREE_FEATURES = {
  basicEventsLimit: "user:basic_events_limit",
  standardVisibility: "user:standard_visibility",
  basicHostProfile: "user:basic_host_profile",
  p2pMessaging: "user:p2p_messaging",
} as const;

export const PRO_FEATURES = {
  unlimitedEvents: "user:unlimited_events",
  eventBoost: "user:event_boost",
  verifiedBadge: "user:verified_badge",
} as const;

export const FEATURES = {
  ...FREE_FEATURES,
  ...PRO_FEATURES,
} as const;

export const FREE_ACTIVE_EVENTS_LIMIT = 2;

