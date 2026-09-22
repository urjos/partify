import ProfileHeroCard from "@/components/profile/ProfileHeroCard";
import ProfileSpotifyCard from "@/components/profile/ProfileSpotifyCard";
import ProfileStats from "@/components/profile/ProfileStats";
import UserOrganizedEventCard from "@/components/profile/UserOrganizedEventCard";
import UserRatingCard from "@/components/profile/UserRatingCard";
import { icons } from "@/constants/icons";
import images from "@/constants/images";
import { colors } from "@/constants/theme";
import { useApi } from "@/hooks/use-api";
import { mapApiEventToEventItem } from "@/lib/api/mappers";
import { useEventStore } from "@/lib/store/eventStore";
import { formatDateProfile } from "@/lib/utils";
import { openWhatsApp } from "@/lib/whatsapp";
import { router, useLocalSearchParams, type Href } from "expo-router";
import { styled } from "nativewind";
import { usePostHog } from "posthog-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Pressable,
  Text,
  View,
} from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

interface UserDetailData {
  id: string;
  name: string;
  username: string;
  bio: string;
  avatarUrl: string | null;
  location: string;
  phone: string;
  rating: number;
  attendedCount: number;
  organizedCount: number;
  spotifyPlaylist: string;
  userRating?: number | null;
  isVerified?: boolean;
}

export default function UserProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const api = useApi();
  const posthog = usePostHog();

  const allEvents = useEventStore((state) => state.events);

  const [loading, setLoading] = useState<boolean>(true);
  const [userData, setUserData] = useState<UserDetailData | null>(null);
  const [userEvents, setUserEvents] = useState<EventItem[]>([]);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [isRatingSubmitting, setIsRatingSubmitting] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    async function loadUserData() {
      if (!id) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const userRes = await api.get<{ success: boolean; data: any }>(
          `/users/${id}`,
        );

        let fetchedEvents: EventItem[] = [];
        try {
          const eventsRes = await api.get<{ success: boolean; data: any[] }>(
            `/events/user/${id}`,
          );
          if (eventsRes?.success && Array.isArray(eventsRes.data)) {
            fetchedEvents = eventsRes.data.map(mapApiEventToEventItem);
          }
        } catch {
          // Si falla la ruta de eventos por usuario, filtrar desde el store local
          fetchedEvents = allEvents.filter(
            (e) =>
              e.authorId === id ||
              (userRes?.data?._id && e.authorId === userRes.data._id),
          );
        }

        if (userRes?.success && userRes.data && isMounted) {
          const raw = userRes.data;
          const cleanEvents =
            fetchedEvents.length > 0
              ? fetchedEvents
              : allEvents.filter(
                  (e) =>
                    e.authorId === id || (raw._id && e.authorId === raw._id),
                );

          const currentRating =
            typeof raw.userRating === "number" ? raw.userRating : null;
          setUserRating(currentRating);

          setUserData({
            id: raw._id || raw.id || id,
            name: raw.name || "Usuario",
            username:
              raw.username ||
              (raw.name
                ? raw.name.toLowerCase().replace(/\s+/g, "")
                : "usuario"),
            bio: raw.bio || "",
            avatarUrl: raw.avatarUrl || null,
            location: raw.location || "",
            phone: raw.phone || "",
            rating: typeof raw.rating === "number" ? raw.rating : 5.0,
            attendedCount: raw.attendedCount ?? 0,
            organizedCount: raw.organizedCount ?? cleanEvents.length,
            spotifyPlaylist: raw.spotifyPlaylist || "",
            userRating: currentRating,
            isVerified: Boolean(raw.isVerified),
          });
          setUserEvents(cleanEvents);
          setLoading(false);
          return;
        }
      } catch (error) {
        console.warn("Error fetching user profile from API:", error);
      }

      if (isMounted) {
        setUserData(null);
        setUserEvents([]);
        setLoading(false);
      }
    }

    loadUserData();

    return () => {
      isMounted = false;
    };
  }, [id, api, allEvents]);

  const handleContactHost = () => {
    posthog.capture("user_contacted", { targetUserId: id });
    if (userData?.phone) {
      openWhatsApp(userData.phone, {
        userName: userData.name,
      });
    } else {
      Alert.alert(
        "Contactar Anfitrión",
        `Este anfitrión aún no ha configurado un teléfono de contacto.`,
      );
    }
  };

  const handleContactEvent = (event: EventItem) => {
    posthog.capture("user_contacted_event", {
      targetUserId: id,
      eventId: event.id,
    });
    const phone = event.contactPhone || userData?.phone;
    if (phone) {
      openWhatsApp(phone, {
        eventTitle: event.title,
      });
    } else {
      Alert.alert(
        "Contactar Anfitrión",
        `Este anfitrión aún no ha configurado un teléfono de contacto para este evento.`,
      );
    }
  };

  const handleRateUser = async (score: number) => {
    if (userRating !== null || isRatingSubmitting || !userData) return;

    // Actualización optimista en UI
    setUserRating(score);
    setIsRatingSubmitting(true);

    posthog.capture("user_rated", {
      targetUserId: id,
      score,
    });

    try {
      const res = await api.post<{ success: boolean; data: any }>(
        `/users/${id}/rate`,
        { score },
      );

      if (res?.success && res.data) {
        if (typeof res.data.rating === "number") {
          setUserData((prev) =>
            prev
              ? {
                  ...prev,
                  rating: res.data.rating,
                  userRating: score,
                }
              : null,
          );
        }
      }
    } catch (error) {
      console.warn("Error enviando calificación de usuario:", error);
    } finally {
      setIsRatingSubmitting(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color={colors.accentPink} />
      </SafeAreaView>
    );
  }

  if (!userData) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center p-6">
        <Text className="text-xl font-bold text-primary mb-2">
          Usuario no encontrado
        </Text>
        <Text className="text-sm text-muted-foreground text-center mb-6">
          No se pudo encontrar el perfil de este usuario o no existe.
        </Text>
        <Pressable
          onPress={() => router.back()}
          className="bg-chip-background px-6 py-3 rounded-full active:opacity-80"
        >
          <Text className="text-sm font-bold text-accent-pink">Volver</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const badgeText =
    userData.organizedCount > 0 ? "Host Verificado" : "Asistente Verificado";

  const renderHeader = () => {
    return (
      <View className="gap-5 mb-4">
        {/* Barra de Navegación Superior */}
        <View className="flex-row items-center justify-between py-2">
          <Pressable
            onPress={() => router.back()}
            className="size-10 rounded-full items-center justify-center bg-modal-background active:opacity-75"
            hitSlop={8}
          >
            <Image
              source={icons.back}
              className="size-5"
              tintColor={colors.primary}
            />
          </Pressable>

          <View className="size-10" />
        </View>

        {/* Tarjeta de Identidad (Hero) */}
        <ProfileHeroCard
          name={userData.name}
          username={userData.username}
          badgeText={badgeText}
          location={userData.location}
          avatarSource={
            userData.avatarUrl ? { uri: userData.avatarUrl } : images.avatar
          }
          bio={userData.bio}
          isVerified={Boolean(userData.isVerified)}
          isOnline={true}
          showContactButton={true}
          onContactPress={handleContactHost}
        />

        {/* Tarjeta de Estadísticas (Karma, Fiestas vividas, Organizadas) */}
        <ProfileStats
          rating={userData.rating}
          attendedCount={userData.attendedCount}
          organizedCount={userData.organizedCount}
        />

        {/* Tarjeta de Calificación Interactiva */}
        <UserRatingCard
          userRating={userRating}
          onRate={handleRateUser}
          disabled={isRatingSubmitting || userRating !== null}
        />

        {/* Tarjeta de Playlist de Spotify */}
        {userData.spotifyPlaylist ? (
          <ProfileSpotifyCard
            playlistUrl={userData.spotifyPlaylist}
            onEditPress={handleContactHost}
          />
        ) : null}

        {/* Título de la Sección de Eventos */}
        <View className="flex-row items-center justify-between mt-2">
          <Text className="text-base font-bold text-primary">
            Eventos organizados ({userEvents.length})
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView
      edges={["top", "left", "right"]}
      className="flex-1 bg-background page-all"
    >
      <FlatList
        data={userEvents}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ItemSeparatorComponent={() => <View className="h-6" />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
        renderItem={({ item }) => {
          const firstMedia = item.media?.[0];
          const imageSource = firstMedia
            ? "source" in firstMedia && firstMedia.source
              ? firstMedia.source
              : "uri" in firstMedia && firstMedia.uri
                ? { uri: firstMedia.uri }
                : images.noriel
            : images.noriel;

          const priceLabel = item.isFreeEvent ? "Gratis" : "";

          return (
            <UserOrganizedEventCard
              id={item.id}
              title={item.title}
              location={item.location}
              dateBadge={
                formatDateProfile(item.startAt) || item.dateLabel || ""
              }
              priceLabel={priceLabel}
              image={imageSource}
              isOwner={true}
              onPressDetails={() => router.push(`/(events)/${item.id}` as Href)}
              onPressContact={() => handleContactEvent(item)}
            />
          );
        }}
        ListEmptyComponent={
          <View className="items-center justify-center py-10">
            <Text className="text-sm font-medium text-muted-foreground">
              Este usuario aún no tiene eventos publicados.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
