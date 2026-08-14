import { useAuth, useSignUp } from "@clerk/expo";
import { Link, router } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AuthButton from "@/components/auth/AuthButton";
import AuthField from "@/components/auth/AuthField";
import AuthHeader from "@/components/auth/AuthHeader";
import { getFriendlyAuthError } from "@/lib/auth-errors";
import {
  getCodeError,
  getNameError,
  getPasswordError,
  isValidEmail,
} from "@/lib/validation";

type Step = "details" | "verify";

const SignUp = () => {
  const { signUp } = useSignUp();
  const { isSignedIn, isLoaded } = useAuth();

  const [step, setStep] = useState<Step>("details");

  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");

  const [nameError, setNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [codeError, setCodeError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (isSignedIn) {
    router.replace("/(tabs)");
    return null;
  }

  const handleCreateAccount = async () => {
    if (!isLoaded || submitting) return;

    const trimmedName = firstName.trim();
    const trimmedEmail = email.trim();
    const nextNameError = getNameError(trimmedName);
    const nextEmailError = isValidEmail(trimmedEmail)
      ? null
      : "Enter a valid email.";
    const nextPasswordError = getPasswordError(password);

    setNameError(nextNameError);
    setEmailError(nextEmailError);
    setPasswordError(nextPasswordError);
    setFormError(null);

    if (nextNameError || nextEmailError || nextPasswordError) return;

    setSubmitting(true);
    try {
      const { error } = await signUp.password({
        emailAddress: trimmedEmail,
        password,
        firstName: trimmedName,
      });

      if (error) {
        setFormError(
          getFriendlyAuthError(
            error,
            "We couldn't create your account. Try again.",
          ),
        );
        return;
      }

      const { error: sendError } = await signUp.verifications.sendEmailCode();
      if (sendError) {
        setFormError(
          getFriendlyAuthError(
            sendError,
            "We couldn't send the verification code.",
          ),
        );
        return;
      }

      setStep("verify");
    } catch {
      setFormError(
        "Something went wrong. Check your connection and try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerify = async () => {
    if (!isLoaded || submitting) return;

    const trimmedCode = code.trim();
    const nextCodeError = getCodeError(trimmedCode);
    setCodeError(nextCodeError);
    setFormError(null);
    if (nextCodeError) return;

    setSubmitting(true);
    try {
      const { error } = await signUp.verifications.verifyEmailCode({
        code: trimmedCode,
      });
      if (error) {
        setFormError(
          getFriendlyAuthError(error, "That code didn't work. Try again."),
        );
        return;
      }

      const { error: finalizeError } = await signUp.finalize();
      if (finalizeError) {
        setFormError(
          getFriendlyAuthError(
            finalizeError,
            "We couldn't finish creating your account.",
          ),
        );
        return;
      }

      router.replace("/(tabs)");
    } catch {
      setFormError(
        "Something went wrong. Check your connection and try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    if (!isLoaded || submitting) return;
    setFormError(null);
    try {
      await signUp.verifications.sendEmailCode();
    } catch {
      setFormError("We couldn't resend the code. Try again in a moment.");
    }
  };

  return (
    <SafeAreaView className="auth-safe-area" edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        className="auth-screen"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          className="auth-scroll"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="auth-content">
            {step === "details" ? (
              <>
                <AuthHeader
                  title="Create your account"
                  subtitle="Join Partify and never miss what's happening nearby."
                />

                <View className="auth-card">
                  <View className="auth-form">
                    <AuthField
                      label="First name"
                      placeholder="Alex"
                      value={firstName}
                      onChangeText={(value) => {
                        setFirstName(value);
                        if (nameError) setNameError(null);
                      }}
                      error={nameError}
                    />

                    <AuthField
                      label="Email"
                      placeholder="you@example.com"
                      keyboardType="email-address"
                      value={email}
                      onChangeText={(value) => {
                        setEmail(value);
                        if (emailError) setEmailError(null);
                      }}
                      error={emailError}
                    />

                    <AuthField
                      label="Password"
                      placeholder="At least 8 characters"
                      secureTextEntry
                      value={password}
                      onChangeText={(value) => {
                        setPassword(value);
                        if (passwordError) setPasswordError(null);
                      }}
                      error={passwordError}
                    />

                    {formError ? (
                      <Text className="auth-error">{formError}</Text>
                    ) : null}

                    <AuthButton
                      label="Create account"
                      onPress={handleCreateAccount}
                      loading={submitting}
                    />

                    <Text className="auth-helper">
                      By continuing you agree to Partify's Terms and Privacy
                      Policy.
                    </Text>
                  </View>
                </View>

                <View className="auth-link-row">
                  <Text className="auth-link-copy">
                    Already have an account?
                  </Text>
                  <Link href="/(auth)/sign-in" className="auth-link">
                    Sign in
                  </Link>
                </View>
              </>
            ) : (
              <>
                <AuthHeader
                  title="Check your email"
                  subtitle={`Enter the 6-digit code we sent to ${email.trim()}.`}
                />

                <View className="auth-card">
                  <View className="auth-form">
                    <AuthField
                      label="Verification code"
                      placeholder="123456"
                      keyboardType="number-pad"
                      maxLength={6}
                      value={code}
                      onChangeText={(value) => {
                        setCode(value);
                        if (codeError) setCodeError(null);
                      }}
                      error={codeError}
                    />

                    {formError ? (
                      <Text className="auth-error">{formError}</Text>
                    ) : null}

                    <AuthButton
                      label="Verify and continue"
                      onPress={handleVerify}
                      loading={submitting}
                    />

                    <TouchableOpacity
                      onPress={handleResendCode}
                      disabled={submitting}
                    >
                      <Text
                        className="auth-secondary-button-text"
                        style={{ textAlign: "center" }}
                      >
                        Resend code
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignUp;
