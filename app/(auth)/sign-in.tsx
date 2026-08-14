import { useAuth, useSignIn } from "@clerk/expo";
import { Link, router } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AuthButton from "@/components/auth/AuthButton";
import AuthField from "@/components/auth/AuthField";
import AuthHeader from "@/components/auth/AuthHeader";
import { getFriendlyAuthError } from "@/lib/auth-errors";
import { isValidEmail } from "@/lib/validation";

const SignIn = () => {
  const { signIn } = useSignIn();
  const { isLoaded, isSignedIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (isSignedIn) {
    router.replace("/(tabs)");
    return null;
  }

  const handleSubmit = async () => {
    if (!isLoaded || submitting) return;

    const trimmedEmail = email.trim();
    const nextEmailError = isValidEmail(trimmedEmail)
      ? null
      : "Enter a valid email.";
    const nextPasswordError =
      password.length > 0 ? null : "Enter your password.";

    setEmailError(nextEmailError);
    setPasswordError(nextPasswordError);
    setFormError(null);

    if (nextEmailError || nextPasswordError) return;

    setSubmitting(true);
    try {
      const { error } = await signIn.password({
        identifier: trimmedEmail,
        password,
      });

      if (error) {
        setFormError(
          getFriendlyAuthError(error, "We couldn't sign you in. Try again."),
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
            <AuthHeader
              title="Welcome back"
              subtitle="Sign in to see what's happening near you tonight."
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

                <AuthField
                  label="Password"
                  placeholder="Your password"
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

                <Link
                  href="/(auth)/forgot-password"
                  className="auth-link self-end"
                >
                  Forgot password?
                </Link>

                <AuthButton
                  label="Sign in"
                  onPress={handleSubmit}
                  loading={submitting}
                />
              </View>
            </View>

            <View className="auth-link-row">
              <Text className="auth-link-copy">New to Partify?</Text>
              <Link href="/(auth)/sign-up" className="auth-link">
                Create an account
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignIn;
