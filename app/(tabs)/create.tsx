import EventForm from "@/components/event/EventForm";
import LoadingScreen from "@/components/shared/LoadingScreen";
import UpgradeToProModal from "@/components/subscription/UpgradeToProModal";
import "@/global.css";
import { useApi } from "@/hooks/use-api";
import { useBilling } from "@/hooks/use-billing";
import { FREE_ACTIVE_EVENTS_LIMIT } from "@/lib/billing/plans";
import { useEventStore } from "@/lib/store/eventStore";
import { LinearGradient } from "expo-linear-gradient";
import { router, useFocusEffect } from "expo-router";
import { AlertCircle, Sparkles } from "lucide-react-native";
import { styled } from "nativewind";
import React, { useCallback, useState } from "react";
import { ActivityIndicator, Alert, Pressable, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

const CreateEvent = () => {
  const api = useApi();
  const addEvent = useEventStore((state) => state.addEvent);
  const { isLoaded: billingLoaded, hasUnlimitedEvents } = useBilling();

  const [activeEventsCount, setActiveEventsCount] = useState<number | null>(
    null,
  );
  const [loadingCount, setLoadingCount] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const fetchActiveEventsCount = useCallback(async () => {
    try {
      setLoadingCount(true);
      setFetchError(null);
      const response = await api.get<{ data: EventItem[] }>("/events/user/me");
      const count = response.data?.length ?? 0;
      setActiveEventsCount(count);
      if (!hasUnlimitedEvents && count >= FREE_ACTIVE_EVENTS_LIMIT) {
        setShowUpgradeModal(true);
      }
    } catch (error) {
      setFetchError(
        error instanceof Error
          ? error.message
          : "Error al verificar tus eventos activos.",
      );
    } finally {
      setLoadingCount(false);
    }
  }, [api, hasUnlimitedEvents]);

  useFocusEffect(
    useCallback(() => {
      fetchActiveEventsCount();
    }, [fetchActiveEventsCount]),
  );

  const isBlocked =
    billingLoaded &&
    !hasUnlimitedEvents &&
    activeEventsCount !== null &&
    activeEventsCount >= FREE_ACTIVE_EVENTS_LIMIT;

  const handleSubmit = async (draft: Omit<EventItem, "id">) => {
    // Re-verificar límite antes de enviar
    if (
      !hasUnlimitedEvents &&
      activeEventsCount !== null &&
      activeEventsCount >= FREE_ACTIVE_EVENTS_LIMIT
    ) {
      setShowUpgradeModal(true);
      return;
    }

    try {
      const newEvent = await addEvent(api, draft);
      router.replace(`/(events)/${newEvent.id}`);
    } catch (error) {
      Alert.alert(
        "Couldn't publish event",
        error instanceof Error ? error.message : "Try again in a moment.",
      );
    }
  };

  // Estado de carga inicial
  if (!billingLoaded || (loadingCount && activeEventsCount === null)) {
    return <LoadingScreen message="Verificando límites del plan..." />;
  }

  // Estado de error al obtener conteo sin datos previos
  if (fetchError && activeEventsCount === null) {
    return (
      <SafeAreaView className="flex-1 bg-black justify-center items-center px-6">
        <AlertCircle size={44} color="#f87171" />
        <Text className="text-white font-bold text-lg mt-4 text-center">
          No pudimos verificar tus eventos
        </Text>
        <Text className="text-white/60 text-sm mt-2 text-center">
          {fetchError}
        </Text>
        <Pressable
          onPress={fetchActiveEventsCount}
          className="mt-6 px-6 py-3 rounded-full bg-white/10 active:opacity-75"
        >
          <Text className="text-white font-semibold text-sm">Reintentar</Text>
        </Pressable>
        <Pressable
          onPress={() => router.back()}
          className="mt-3 px-6 py-2 active:opacity-75"
        >
          <Text className="text-white/50 text-sm">Volver</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  if (isBlocked) {
    return (
      <SafeAreaView className="flex-1 bg-black justify-center page-all">
        <View className="items-center py-8">
          <View className="size-20 rounded-full bg-[#241320] border border-[#ea4bc8]/40 items-center justify-center mb-6">
            <Sparkles size={36} color="#ea4bc8" />
          </View>
          <Text className="text-2xl font-black text-white text-center">
            Límite de fiestas alcanzado
          </Text>
          <Text className="text-white/60 text-sm text-center mt-3 leading-5 max-w-xs">
            Tienes {activeEventsCount} de {FREE_ACTIVE_EVENTS_LIMIT} eventos
            activos en el Plan Free. Pásate a Partify Pro para publicar eventos
            ilimitados simultáneamente.
          </Text>
        </View>

        <View className="gap-3">
          <Pressable
            onPress={() => setShowUpgradeModal(true)}
            className="rounded-2xl overflow-hidden active:opacity-85"
          >
            <LinearGradient
              colors={["#ea4bc8", "#b24bfb"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className="py-4 items-center justify-center"
            >
              <Text className="text-white font-extrabold text-base tracking-wide">
                Mejora a Partify Pro - $5.99/mes
              </Text>
            </LinearGradient>
          </Pressable>

          <Pressable
            onPress={() => router.back()}
            className="py-3 items-center justify-center active:opacity-60"
          >
            <Text className="text-muted-foreground font-medium text-xs">
              Volver al inicio
            </Text>
          </Pressable>
        </View>

        <UpgradeToProModal
          visible={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          reason="limit_reached"
          currentActiveEvents={activeEventsCount}
        />
      </SafeAreaView>
    );
  }

  return (
    <>
      <EventForm
        screenTitle="Crear Evento"
        submitLabel="Publicar evento"
        submittingLabel="Publicando..."
        onSubmit={handleSubmit}
      />
      <UpgradeToProModal
        visible={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        reason="limit_reached"
        currentActiveEvents={activeEventsCount ?? undefined}
      />
    </>
  );
};

export default CreateEvent;
