const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const isValidEmail = (value: string): boolean =>
  EMAIL_REGEX.test(value.trim());

export const getPasswordError = (value: string): string | null => {
  if (value.length < 8) return "Use at least 8 characters.";
  if (!/[a-zA-Z]/.test(value) || !/[0-9]/.test(value)) {
    return "Mix letters and numbers for a stronger password.";
  }
  return null;
};

export const getNameError = (value: string): string | null => {
  if (!value.trim()) return "Tell us what to call you.";
  if (value.trim().length < 2) return "That name looks too short.";
  return null;
};

export const getCodeError = (value: string): string | null => {
  if (!/^\d{6}$/.test(value.trim())) return "Enter the 6-digit code.";
  return null;
};
