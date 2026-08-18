import Constants from "expo-constants";
import PostHog from "posthog-react-native";

const rawApiKey = Constants.expoConfig?.extra?.posthogProjectToken as
  | string
  | undefined;
const rawHost = Constants.expoConfig?.extra?.posthogHost as string | undefined;

const projectToken = rawApiKey?.trim();
const host = rawHost?.trim();
const isPostHogConfigured = Boolean(projectToken);

if (!isPostHogConfigured && __DEV__) {
  throw new Error(
    "POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_PROJECT_TOKEN is configured",
  );
}

export const posthog = new PostHog(projectToken as string, {
  ...(host ? { host } : {}),
  disabled: !isPostHogConfigured,
  errorTracking: {
    autocapture: {
      uncaughtExceptions: true,
      unhandledRejections: true,
      console: false,
    },
  },
});
