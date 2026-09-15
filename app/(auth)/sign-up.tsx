import GoogleIcon from "@/components/auth/GoogleIcon";
import { icons } from "@/constants/icons";
import { useAuth, useSignUp } from "@clerk/expo";
import { useSSO } from "@clerk/expo/experimental";
import { Link, useRouter, type Href } from "expo-router";
import { styled } from "nativewind";
import { usePostHog } from "posthog-react-native";
import { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

const SignUp = () => {
  const { signUp, errors, fetchStatus } = useSignUp();
  const { isSignedIn } = useAuth();
  const { startSSOFlow } = useSSO();
  const router = useRouter();
  const posthog = usePostHog();

  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogleSignUp = async () => {
    setGoogleLoading(true);
    try {
      const { createdSessionId } = await startSSOFlow({
        strategy: "oauth_google",
      });

      if (createdSessionId) {
        posthog.capture("user_signed_in", { method: "google" });
        router.replace("/(tabs)" as Href);
      }
    } catch (error) {
      console.error("Google sign-up error:", error);
    } finally {
      setGoogleLoading(false);
    }
  };

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [code, setCode] = useState("");

  // Validation states
  const [firstNameTouched, setFirstNameTouched] = useState(false);
  const [lastNameTouched, setLastNameTouched] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);

  // Client-side validation
  const firstNameValid = firstName.length === 0 || firstName.trim().length >= 2;
  const lastNameValid = lastName.length === 0 || lastName.trim().length >= 2;
  const emailValid =
    emailAddress.length === 0 ||
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress);
  const passwordValid = password.length === 0 || password.length >= 8;
  const confirmPasswordValid =
    confirmPassword.length === 0 || confirmPassword === password;

  const formValid =
    firstName.trim().length >= 2 &&
    lastName.trim().length >= 2 &&
    emailAddress.length > 0 &&
    emailValid &&
    password.length >= 8 &&
    confirmPassword.length > 0 &&
    confirmPassword === password;

  const handleSubmit = async () => {
    if (!formValid) return;

    const { error } = await signUp.password({
      emailAddress,
      password,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
    });

    if (error) {
      console.error(JSON.stringify(error, null, 2));
      posthog.capture("user_sign_up_failed");
      return;
    }

    // Send verification email
    if (!error) {
      await signUp.verifications.sendEmailCode();
    }
  };

  const handleVerify = async () => {
    await signUp.verifications.verifyEmailCode({
      code,
    });

    if (signUp.status === "complete") {
      await signUp.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) {
            console.log(session?.currentTask);
            return;
          }

          if (!session?.user?.id) {
            console.error("Sign-up completed without a Clerk user ID");
            return;
          }

          posthog.identify(session.user.id, {
            $set: {
              email: emailAddress,
              first_name: firstName.trim(),
              last_name: lastName.trim(),
              name: `${firstName.trim()} ${lastName.trim()}`.trim(),
            },
            $set_once: { sign_up_date: new Date().toISOString() },
          });
          posthog.capture("user_signed_up");

          const url = decorateUrl("/(tabs)");
          if (url.startsWith("http")) {
            // Only use window.location on web platform
            if (typeof window !== "undefined" && window.location) {
              window.location.href = url;
            } else {
              // On native, just use router navigation
              router.replace("/(tabs)" as Href);
            }
          } else {
            router.replace(url as Href);
          }
        },
      });
    } else {
      console.error("Sign-up attempt not complete:", signUp);
    }
  };

  // Don't show anything if already signed in or sign-up is complete
  if (signUp.status === "complete" || isSignedIn) {
    return null;
  }

  // Show verification screen if email needs verification
  if (
    signUp.status === "missing_requirements" &&
    signUp.unverifiedFields.includes("email_address") &&
    signUp.missingFields.length === 0
  ) {
    return (
      <SafeAreaView className="auth-safe-area">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="auth-screen"
        >
          <ScrollView
            className="auth-scroll"
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View className="auth-content">
              {/* Branding */}
              <View className="auth-brand-block">
                <View className="auth-logo-wrap">
                  <Image source={icons.logowb2} className="auth-logo" />
                  <Text className="auth-wordmark">Partify</Text>
                </View>
                <View className="gap-2">
                  <Text className="auth-title">Verifica tu correo</Text>
                  <Text className="auth-subtitle">
                    Enviamos un código de verificación a {emailAddress}
                  </Text>
                </View>
              </View>

              {/* Verification Form */}
              <View className="auth-card">
                <View className="auth-form">
                  <View className="auth-field">
                    <Text className="auth-label">Código de verificación</Text>
                    <TextInput
                      className="auth-input"
                      value={code}
                      placeholder="Ingresa el código de 6 dígitos"
                      onChangeText={setCode}
                      keyboardType="number-pad"
                      autoComplete="one-time-code"
                      maxLength={6}
                    />
                    {errors.fields.code && (
                      <Text className="auth-error">
                        {errors.fields.code.message}
                      </Text>
                    )}
                  </View>

                  <View className="gap-4">
                    <Pressable
                      className={`auth-button ${(!code || fetchStatus === "fetching") && "auth-button-disabled"}`}
                      onPress={handleVerify}
                      disabled={!code || fetchStatus === "fetching"}
                    >
                      <Text className="auth-button-text">
                        {fetchStatus === "fetching"
                          ? "Verificando..."
                          : "Verificar correo"}
                      </Text>
                    </Pressable>

                    <Pressable
                      className="auth-secondary-button"
                      onPress={() => signUp.verifications.sendEmailCode()}
                      disabled={fetchStatus === "fetching"}
                    >
                      <Text className="auth-secondary-button-text">
                        Reenviar código
                      </Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  // Main sign-up form
  return (
    <SafeAreaView className="auth-safe-area">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="auth-screen"
      >
        <ScrollView
          className="auth-scroll"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="auth-content">
            {/* Branding */}
            <View className="auth-brand-block">
              <View className="auth-logo-wrap">
                <Image source={icons.logowb2} className="auth-logo" />
                <Text className="auth-wordmark">Partify</Text>
              </View>
              <View className="gap-2">
                <Text className="auth-title">Crea tu cuenta</Text>
                <Text className="auth-subtitle">
                  Comienza tu experiencia en Partify
                </Text>
              </View>
            </View>

            {/* Sign-Up Form */}
            <View className="auth-card">
              <View className="auth-form">
                {/* Nombre y Apellido */}
                <View className="flex-row gap-3">
                  <View className="auth-field flex-1">
                    <Text className="auth-label">Nombre</Text>
                    <TextInput
                      className={`auth-input ${firstNameTouched && !firstNameValid && "auth-input-error"}`}
                      value={firstName}
                      placeholder="Ej. Juan"
                      onChangeText={setFirstName}
                      onBlur={() => setFirstNameTouched(true)}
                      autoCapitalize="words"
                      autoComplete="given-name"
                    />
                    {firstNameTouched && !firstNameValid && (
                      <Text className="auth-error">Mínimo 2 caracteres</Text>
                    )}
                  </View>

                  <View className="auth-field flex-1">
                    <Text className="auth-label">Apellido</Text>
                    <TextInput
                      className={`auth-input ${lastNameTouched && !lastNameValid && "auth-input-error"}`}
                      value={lastName}
                      placeholder="Ej. Pérez"
                      onChangeText={setLastName}
                      onBlur={() => setLastNameTouched(true)}
                      autoCapitalize="words"
                      autoComplete="family-name"
                    />
                    {lastNameTouched && !lastNameValid && (
                      <Text className="auth-error">Mínimo 2 caracteres</Text>
                    )}
                  </View>
                </View>

                {/* Email */}
                <View className="auth-field">
                  <Text className="auth-label">Correo electrónico</Text>
                  <TextInput
                    className={`auth-input ${emailTouched && !emailValid && "auth-input-error"}`}
                    autoCapitalize="none"
                    value={emailAddress}
                    placeholder="nombre@ejemplo.com"
                    onChangeText={setEmailAddress}
                    onBlur={() => setEmailTouched(true)}
                    keyboardType="email-address"
                    autoComplete="email"
                  />
                  {emailTouched && !emailValid && (
                    <Text className="auth-error">
                      Por favor, ingresa un correo electrónico válido
                    </Text>
                  )}
                  {errors.fields.emailAddress && (
                    <Text className="auth-error">
                      {errors.fields.emailAddress.message}
                    </Text>
                  )}
                </View>

                {/* Contraseña */}
                <View className="auth-field">
                  <Text className="auth-label">Contraseña</Text>
                  <TextInput
                    className={`auth-input ${passwordTouched && !passwordValid && "auth-input-error"}`}
                    value={password}
                    placeholder="Crea una contraseña segura"
                    secureTextEntry
                    onChangeText={setPassword}
                    onBlur={() => setPasswordTouched(true)}
                    autoComplete="password-new"
                  />
                  {passwordTouched && !passwordValid && (
                    <Text className="auth-error">
                      La contraseña debe tener al menos 8 caracteres
                    </Text>
                  )}
                  {errors.fields.password && (
                    <Text className="auth-error">
                      {errors.fields.password.message}
                    </Text>
                  )}
                </View>

                {/* Confirmar Contraseña */}
                <View className="auth-field">
                  <Text className="auth-label">Confirmar contraseña</Text>
                  <TextInput
                    className={`auth-input ${confirmPasswordTouched && !confirmPasswordValid && "auth-input-error"}`}
                    value={confirmPassword}
                    placeholder="Repite tu contraseña"
                    secureTextEntry
                    onChangeText={setConfirmPassword}
                    onBlur={() => setConfirmPasswordTouched(true)}
                    autoComplete="password-new"
                  />
                  {confirmPasswordTouched && !confirmPasswordValid && (
                    <Text className="auth-error">
                      Las contraseñas no coinciden
                    </Text>
                  )}
                </View>

                <Pressable
                  className={`auth-button ${(!formValid || fetchStatus === "fetching") && "auth-button-disabled"}`}
                  onPress={handleSubmit}
                  disabled={!formValid || fetchStatus === "fetching"}
                >
                  <Text className="auth-button-text">
                    {fetchStatus === "fetching"
                      ? "Creando cuenta..."
                      : "Crear cuenta"}
                  </Text>
                </Pressable>

                <View className="auth-divider-row">
                  <View className="auth-divider-line" />
                  <Text className="auth-divider-text">o</Text>
                  <View className="auth-divider-line" />
                </View>

                <Pressable
                  className={`auth-google-button ${googleLoading && "auth-button-disabled"}`}
                  onPress={handleGoogleSignUp}
                  disabled={googleLoading}
                >
                  <GoogleIcon size={18} />
                  <Text className="auth-google-button-text">
                    {googleLoading
                      ? "Registrándose..."
                      : "Continuar con Google"}
                  </Text>
                </Pressable>
              </View>
            </View>

            {/* Sign-In Link */}
            <View className="auth-link-row">
              <Text className="auth-link-copy">¿Ya tienes una cuenta?</Text>
              <Link href="/(auth)/sign-in" asChild>
                <Pressable>
                  <Text className="auth-link">Iniciar sesión</Text>
                </Pressable>
              </Link>
            </View>

            {/* Required for Clerk's bot protection */}
            <View nativeID="clerk-captcha" />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignUp;
