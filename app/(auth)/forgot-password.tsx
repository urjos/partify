import { useSignIn } from "@clerk/expo";
import { Link, router } from "expo-router";
import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AuthButton from "@/components/auth/AuthButton";
import AuthField from "@/components/auth/AuthField";
import AuthHeader from "@/components/auth/AuthHeader";
import { getFriendlyAuthError } from "@/lib/auth-errors";
import { getCodeError, getPasswordError, isValidEmail } from "@/lib/validation";

type Step = "request" | "reset";

const ForgotPassword = () => {
  const { isLoaded, signIn } = useSignIn();

  const [step, setStep] = useState<Step>("request");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState<string | null>(null);
  const [codeError, setCodeError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleRequestCode = async () => {
    if (!isLoaded || submitting) return;

    const trimmedEmail = email.trim();
    const nextEmailError = isValidEmail(trimmedEmail) ? null : "Enter a valid email.";
    setEmailError(nextEmailError);
    setFormError(null);
    if (nextEmailError) return;

    setSubmitting(true);
    try {
      const { error } = await signIn.verifications.sendResetPasswordEmailCode({
        identifier: trimmedEmail,
      });

      if (error) {
        setFormError(getFriendlyAuthError(error, "We couldn't send a reset code."));
        return;
      }

      setStep("reset");
    } catch {
      setFormError("Something went wrong. Check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetPassword = async () => {
    if (!isLoaded || submitting) return;

    const trimmedCode = code.trim();
    const nextCodeError = getCodeError(trimmedCode);
    const nextPasswordError = getPasswordError(password);
    setCodeError(nextCodeError);
    setPasswordError(nextPasswordError);
    setFormError(null);
    if (nextCodeError || nextPasswordError) return;

    setSubmitting(true);
    try {
      const { error } = await signIn.verifications.resetPassword({
        code: trimmedCode,
        password,
      });

      if (error) {
        setFormError(getFriendlyAuthError(error, "We couldn't reset your password."));
        return;
      }

      router.replace("/(tabs)");
    } catch {
      setFormError("Something went wrong. Check your connection and try again.");
    } finally {
      setSubmitting(false);
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
            {step === "request" ? (
              <>
                <AuthHeader
                  title="Reset your password"
                  subtitle="We'll email you a code to get back in."
                />

                <View className="auth-card">
                  <View className="auth-form">
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

                    {formError ? <Text className="auth-error">{formError}</Text> : null}

                    <AuthButton
                      label="Send reset code"
                      onPress={handleRequestCode}
                      loading={submitting}
                    />
                  </View>
                </View>
              </>
            ) : (
              <>
                <AuthHeader
                  title="Set a new password"
                  subtitle={`Enter the code sent to ${email.trim()} and choose a new password.`}
                />

                <View className="auth-card">
                  <View className="auth-form">
                    <AuthField
                      label="Reset code"
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

                    <AuthField
                      label="New password"
                      placeholder="At least 8 characters"
                      secureTextEntry
                      value={password}
                      onChangeText={(value) => {
                        setPassword(value);
                        if (passwordError) setPasswordError(null);
                      }}
                      error={passwordError}
                    />

                    {formError ? <Text className="auth-error">{formError}</Text> : null}

                    <AuthButton
                      label="Reset password"
                      onPress={handleResetPassword}
                      loading={submitting}
                    />
                  </View>
                </View>
              </>
            )}

            <View className="auth-link-row">
              <Link href="/(auth)/sign-in" className="auth-link">
                Back to sign in
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ForgotPassword;
