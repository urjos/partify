const MESSAGES: Record<string, string> = {
  form_identifier_not_found: "We couldn't find an account with that email.",
  form_identifier_exists: "An account with that email already exists.",
  form_password_incorrect: "That password doesn't match this email.",
  form_password_pwned:
    "That password has shown up in a data breach. Pick a different one.",
  form_password_length_too_short: "Your password is too short.",
  form_param_format_invalid: "That doesn't look like a valid email.",
  form_code_incorrect: "That code isn't right. Double-check and try again.",
  verification_expired: "That code expired. Request a new one.",
  too_many_requests: "Too many attempts. Wait a moment and try again.",
};

type MaybeErrorLike = {
  code?: string;
  message?: string;
  longMessage?: string;
  // Older Clerk SDKs nested errors in an array; newer ones return a flat object.
  // We handle both shapes so this keeps working across SDK versions.
  errors?: { code?: string; message?: string; longMessage?: string }[];
};

// Accepts `unknown` on purpose: the exact error type differs between Clerk SDK
// generations (flat object vs. `{ errors: [...] }`), and callers shouldn't have
// to fight TypeScript over which shape their installed version uses.
export const getFriendlyAuthError = (
  error: unknown,
  fallback: string,
): string => {
  if (!error || typeof error !== "object") return fallback;

  const err = error as MaybeErrorLike;
  const code = err.code ?? err.errors?.[0]?.code;
  if (code && MESSAGES[code]) return MESSAGES[code];

  const long =
    err.longMessage ??
    err.errors?.[0]?.longMessage ??
    err.message ??
    err.errors?.[0]?.message;
  return long || fallback;
};
