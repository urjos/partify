import EventActionBar from "@/components/event/detail/EventActionBar";
import EventAttendeesCard from "@/components/event/detail/EventAttendeesCard";
import EventMainCard from "@/components/event/detail/EventMainCard";
import EventMeetingPointCard from "@/components/event/detail/EventMeetingPointCard";
import EventNightDetailsCard from "@/components/event/detail/EventNightDetailsCard";
import EventOrganizerCard from "@/components/event/detail/EventOrganizerCard";
import EventMediaCarousel from "@/components/event/EventMediaCarousel";
import { colors } from "@/constants/theme";
import "@/global.css";
import { useApi } from "@/hooks/use-api";
import { useEventStore } from "@/lib/store/eventStore";
import { openWhatsApp } from "@/lib/whatsapp";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams, type Href } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Linking,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EventDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const api = useApi();
  const events = useEventStore((state) => state.events);
  const removeEvent = useEventStore((state) => state.removeEvent);
  const setAttendanceAction = useEventStore((state) => state.setAttendance);
  const rateEventAction = useEventStore((state) => state.rateEvent);
  const toggleFavoriteAction = useEventStore((state) => state.toggleFavorite);

  const event = events.find((item) => item.id === id);

  // Estados locales para interactividad fluida
  const [status, setStatus] = useState<AttendanceStatus>(
    event?.isGoing ? "going" : null,
  );
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState<boolean>(
    Boolean(event?.isFavorite),
  );
  const [userRating, setUserRating] = useState<number | null>(
    event?.userRating ?? null,
  );

  React.useEffect(() => {
    if (event) {
      setIsFavorite(Boolean(event.isFavorite));
      setUserRating(event.userRating ?? null);
      setStatus(event.isGoing ? "going" : null);
    }
  }, [event?.isFavorite, event?.userRating, event?.isGoing]);

  if (!event) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center p-6 gap-4">
        <Ionicons
          name="calendar-outline"
          size={48}
          color={colors.mutedForeground}
        />
        <Text className="text-base text-center text-muted-foreground font-medium">
          No pudimos encontrar este evento. Es posible que haya sido cancelado.
        </Text>
        <Pressable
          className="bg-card border border-border px-6 py-3 rounded-2xl active:opacity-75"
          onPress={() => router.back()}
        >
          <Text className="text-sm font-bold text-primary">Volver</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const isOwner = event.isOwner ?? false;
  const goingCount =
    event.attendeeCount + (status === "going" && !event.isGoing ? 1 : 0);
  const interestedCount =
    event.interestedCount + (status === "interested" ? 1 : 0);

  const handleToggleFavorite = async () => {
    const previous = isFavorite;
    setIsFavorite(!previous);
    try {
      const nextFavState = await toggleFavoriteAction(api, event.id);
      setIsFavorite(nextFavState);
    } catch {
      setIsFavorite(previous);
      Alert.alert(
        "Error",
        "No se pudo actualizar tu lista de favoritos. Inténtalo de nuevo.",
      );
    }
  };

  const handleRateEvent = async (score: number) => {
    const previous = userRating;
    setUserRating(score);
    try {
      await rateEventAction(api, event.id, score);
    } catch (error) {
      setUserRating(previous);
      Alert.alert(
        "Error al calificar",
        error instanceof Error ? error.message : "Inténtalo de nuevo.",
      );
    }
  };

  const handleToggleStatus = async (next: Exclude<AttendanceStatus, null>) => {
    const previous = status;
    const nextStatus = previous === next ? null : next;
    setStatus(nextStatus);

    try {
      await setAttendanceAction(api, event.id, nextStatus);
    } catch (error) {
      setStatus(previous);
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Inténtalo de nuevo.",
      );
    }
  };

  const handleContact = async () => {
    // 1. Si el método de contacto es externo y tiene enlace de ticket
    if (event.contactMethod === "external" && event.externalTicketUrl?.trim()) {
      let url = event.externalTicketUrl.trim();
      if (!/^https?:\/\//i.test(url)) {
        url = `https://${url}`;
      }
      try {
        await Linking.openURL(url);
        return;
      } catch {
        Alert.alert(
          "Error al abrir enlace",
          "No se pudo abrir el enlace de compra externo.",
        );
        return;
      }
    }

    // 2. Si el evento tiene número de WhatsApp configurado
    if (event.contactPhone?.trim()) {
      openWhatsApp(event.contactPhone.trim(), { eventTitle: event.title });
      return;
    }

    // 3. Si el evento no tiene número directo pero tiene ID del anfitrión, consultar su teléfono
    if (event.authorId) {
      try {
        const res = await api.get<{ success: boolean; data: any }>(
          `/users/${event.authorId}`,
        );
        if (res?.success && res.data?.phone?.trim()) {
          openWhatsApp(res.data.phone.trim(), { eventTitle: event.title });
          return;
        }
      } catch (err) {
        console.warn("Error fetching host phone for event:", err);
      }
    }

    // 4. Si el método era externo pero no hay URL configurada
    if (event.contactMethod === "external") {
      Alert.alert(
        "Enlace no configurado",
        "El anfitrión de este evento no ha proporcionado el enlace de compra de entradas.",
      );
      return;
    }

    // 5. Alerta cuando no hay ningún método de contacto configurado
    Alert.alert(
      "Contacto no disponible",
      "El anfitrión de este evento no ha configurado un número de WhatsApp para contacto directo.",
    );
  };

  const confirmCancel = () => {
    Alert.alert(
      "¿Cancelar este evento?",
      "Los asistentes serán notificados. Esta acción no se puede deshacer.",
      [
        { text: "Mantener evento", style: "cancel" },
        {
          text: "Cancelar evento",
          style: "destructive",
          onPress: async () => {
            try {
              await removeEvent(api, event.id);
              router.replace("/(tabs)");
            } catch (error) {
              Alert.alert(
                "Error",
                error instanceof Error ? error.message : "Inténtalo de nuevo.",
              );
            }
          },
        },
      ],
    );
  };

  return (
    <View className="flex-1 bg-background">
      {/* Barra Superior Flotante (Siempre visible y sobre el status bar) */}
      <SafeAreaView
        edges={["top"]}
        className="absolute top-0 left-0 right-0 z-50 pointer-events-box-none"
        pointerEvents="box-none"
      >
        <View
          className="flex-row items-center justify-between px-4 pt-1"
          pointerEvents="box-none"
        >
          {/* Botón Atrás */}
          <Pressable
            className="size-11 rounded-full items-center justify-center bg-modal-background/70 border border-border/40 backdrop-blur-md active:opacity-75 pointer-events-auto"
            onPress={() => router.back()}
            hitSlop={8}
          >
            <Ionicons name="arrow-back" size={20} color={colors.primary} />
          </Pressable>

          {/* Botón Favorito */}
          <Pressable
            className="size-11 rounded-full items-center justify-center bg-modal-background/70 border border-border/40 backdrop-blur-md active:opacity-75 pointer-events-auto"
            onPress={handleToggleFavorite}
            hitSlop={8}
          >
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              size={20}
              color={isFavorite ? colors.accentPink : colors.primary}
            />
          </Pressable>
        </View>
      </SafeAreaView>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 110 }}
        className="flex-1"
      >
        {/* ================= 1. MEDIA CAROUSEL (HEADER) ================= */}
        <View className="relative w-full aspect-4/5 min-h-[400px] max-h-[560px] overflow-hidden bg-submodal-background">
          <EventMediaCarousel
            media={event.media}
            className="w-full h-full"
            onIndexChange={setActiveMediaIndex}
          />

          {/* Badge de Categoría (Superior Izquierda) */}
          <View
            className="absolute top-4 left-4 right-4 flex-row items-center justify-between  z-50"
            pointerEvents="box-none"
          >
            {/* Tag de Categoría */}
            <View className="bg-chip-background px-3 py-1 rounded-full">
              <Text className="text-xs font-bold text-primary uppercase traking-normal">
                {event.category}
              </Text>
            </View>

            {/* Contador de fotos (ej. 1/3) */}
            {event.media.length > 1 ? (
              <View className="px-2.5 py-1 rounded-full">
                <Text className="text-xs font-bold text-white">
                  {activeMediaIndex + 1}/{event.media.length}
                </Text>
              </View>
            ) : null}
          </View>

          {/* Indicador de Medios (Inferior Derecha) */}
          {event.media.length > 1 && (
            <View className="absolute bottom-4 right-4 bg-modal-background/80 border border-border/40 px-3 py-1 rounded-full backdrop-blur-md">
              <Text className="text-xs font-semibold text-primary">
                {activeMediaIndex + 1} / {event.media.length}
              </Text>
            </View>
          )}
        </View>

        {/* ================= 2. CONTENIDO PRINCIPAL ================= */}
        <View className="px-4 gap-4 mt-5 z-20">
          {/* Card 1: Información Básica (Título, Precio, Fecha, Ubicación, Rating) */}
          <EventMainCard
            title={event.title}
            price={event.price}
            priceWomen={event.priceWomen}
            isMultiplePrices={event.isMultiplePrices}
            isFreeEvent={event.isFreeEvent}
            typeMusic={event.typeMusic}
            startAt={event.startAt}
            closingAt={event.closingAt}
            location={event.location}
            distanceLabel={event.distanceLabel}
            capacity={event.capacity}
            attendeeCount={goingCount}
            interestedCount={interestedCount}
            rating={event.rating}
            ratingsCount={event.ratingsCount}
            userRating={userRating}
            hideExactAddress={event.hideExactAddress}
            onRate={handleRateEvent}
          />

          {/* Card 2: Asistentes y Amigos */}
          <EventAttendeesCard
            attendeeCount={goingCount}
            attendeeAvatars={event.attendeeAvatars}
          />

          {/* Card 3: Anfitrión */}
          <EventOrganizerCard
            author={event.author}
            authorAvatar={event.authorAvatar}
            rating={event.rating}
            onViewProfile={() => {
              const targetId = event.authorId || event.id;
              router.push(`/(user)/${targetId}` as Href);
            }}
          />

          {/* Card 4: Detalles de la Noche (Beneficios y Reglas) */}
          <EventNightDetailsCard
            description={event.description}
            corkageFree={event.corkageFree}
            openBar={event.openBar}
            dressCode={event.dressCode}
            dressCodeDetails={event.dressCodeDetails}
            isAdultsOnly={event.isAdultsOnly}
            requirePhysicalId={event.requirePhysicalId}
          />

          {/* Card 5: Punto de Encuentro (Mapa, Uber y Waze o Privacidad) */}
          <EventMeetingPointCard
            location={event.location}
            latitude={event.latitude}
            longitude={event.longitude}
            hideExactAddress={event.hideExactAddress}
            contactMethod={event.contactMethod}
            contactPhone={event.contactPhone}
            externalTicketUrl={event.externalTicketUrl}
            eventTitle={event.title}
            onContactPress={handleContact}
          />
        </View>
      </ScrollView>

      {/* ================= 3. BARRA INFERIOR DE ACCIÓN ================= */}
      <EventActionBar
        isOwner={isOwner}
        status={status}
        contactMethod={event.contactMethod}
        externalTicketUrl={event.externalTicketUrl}
        contactPhone={event.contactPhone}
        eventTitle={event.title}
        onToggleStatus={handleToggleStatus}
        onContact={handleContact}
        onEditPress={() => router.push(`/edit/${event.id}`)}
        onCancelPress={confirmCancel}
      />
    </View>
  );
}
