import ProfileHeroCard from "@/components/profile/ProfileHeroCard";
import ProfileSpotifyCard from "@/components/profile/ProfileSpotifyCard";
import ProfileStats from "@/components/profile/ProfileStats";
import UserOrganizedEventCard from "@/components/profile/UserOrganizedEventCard";
import UserRatingCard from "@/components/profile/UserRatingCard";
import { icons } from "@/constants/icons";
import images from "@/constants/images";
import { colors } from "@/constants/theme";
import { useApi } from "@/hooks/use-api";
import { useEventStore } from "@/lib/store/eventStore";
import { formatDateProfile } from "@/lib/utils";
import { openWhatsApp } from "@/lib/whatsapp";
import { router, useLocalSearchParams, type Href } from "expo-router";
import { styled } from "nativewind";
import { usePostHog } from "posthog-react-native";
import React, { useEffect, useMemo, useState } from "react";
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
  socials: {
    instagram?: string;
    tiktok?: string;
    facebook?: string;
  };
}

export default function UserProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const api = useApi();
  const posthog = usePostHog();

  const allEvents = useEventStore((state) => state.events);

  const [loading, setLoading] = useState<boolean>(true);
  const [userData, setUserData] = useState<UserDetailData | null>(null);
  const [userRating, setUserRating] = useState<number | null>(null);

  // Cargar información del usuario desde la API con fallback
  useEffect(() => {
    let isMounted = true;

    async function loadUserData() {
      setLoading(true);
      try {
        if (id && id !== "me") {
          const res = await api.get<{ success: boolean; data: any }>(
            `/users/${id}`,
          );
          if (res?.success && res.data && isMounted) {
            const raw = res.data;
            setUserData({
              id: raw._id || raw.id || id,
              name: raw.name || "Usuario Partify",
              username: raw.username || "usuario",
              bio:
                raw.bio ||
                "Amante de rooftops íntimos, house melódico y buen rollo. Organizo y asisto a sesiones exclusivas en Miraflores y Barranco.",
              avatarUrl: raw.avatarUrl || null,
              location: raw.location || "Miraflores, Lima",
              phone: raw.phone || "",
              rating: raw.rating ?? 4.9,
              attendedCount: raw.attendedCount ?? 14,
              organizedCount: raw.organizedCount ?? 3,
              spotifyPlaylist: raw.spotifyPlaylist || "",
              socials: {
                instagram: raw.socials?.instagram || "mateosilva",
                tiktok: raw.socials?.tiktok || "",
                facebook: raw.socials?.facebook || "",
              },
            });
            setLoading(false);
            return;
          }
        }
      } catch (error) {
        console.warn("Error fetching user profile from API, using fallback:", error);
      }

      // Fallback predeterminado según el diseño de referencia
      if (isMounted) {
        setUserData({
          id: id || "mock-user",
          name: "Mateo Silva",
          username: "mateosilva",
          bio: "Amante de rooftops íntimos, house melódico y buen rollo. Organizo y asisto a sesiones exclusivas en Miraflores y Barranco.",
          avatarUrl: null,
          location: "Miraflores, Lima",
          phone: "+51987654321",
          rating: 4.9,
          attendedCount: 14,
          organizedCount: 3,
          spotifyPlaylist: "https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M",
          socials: {
            instagram: "mateosilva",
            tiktok: "",
          },
        });
        setLoading(false);
      }
    }

    loadUserData();

    return () => {
      isMounted = false;
    };
  }, [id, api]);

  // Eventos organizados por este anfitrión
  const organizedEvents = useMemo(() => {
    const matched = allEvents.filter(
      (e) => e.authorId === id || e.isOwner,
    );

    if (matched.length > 0) return matched;

    // Si no hay eventos en memoria, mostrar los del mockup de la pantalla
    return allEvents.slice(0, 2);
  }, [allEvents, id]);

  const handleContact = () => {
    posthog.capture("user_contacted", { targetUserId: id });
    if (userData?.phone) {
      openWhatsApp(
        userData.phone,
        `Hola ${userData.name}, vi tu perfil en Partify y quisiera más información.`,
      );
    } else {
      Alert.alert(
        "Contactar Anfitrión",
        `Puedes comunicarte con ${userData?.name || "este anfitrión"} a través de sus redes sociales vinculadas.`,
      );
    }
  };

  const handleRateUser = (score: number) => {
    setUserRating(score);
    posthog.capture("user_rated", {
      targetUserId: id,
      score,
    });
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color={colors.accentPink} />
      </SafeAreaView>
    );
  }

  const renderHeader = () => {
    if (!userData) return null;

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

          <Text className="text-lg font-bold text-primary">
            Perfil De Usuario
          </Text>

          <View className="size-10" />
        </View>

        {/* Tarjeta de Identidad (Hero) */}
        <ProfileHeroCard
          name={userData.name}
          username={userData.username}
          badgeText="Host & Asistente Verificado"
          location={userData.location}
          avatarSource={
            userData.avatarUrl ? { uri: userData.avatarUrl } : images.noriel
          }
          bio={userData.bio}
          isVerified={true}
          isOnline={true}
          socials={userData.socials}
          showContactButton={true}
          onContactPress={handleContact}
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
        />

        {/* Tarjeta de Playlist de Spotify */}
        {userData.spotifyPlaylist ? (
          <ProfileSpotifyCard
            playlistUrl={userData.spotifyPlaylist}
            onEditPress={handleContact}
          />
        ) : null}

        {/* Título de la Sección de Eventos */}
        <View className="flex-row items-center justify-between mt-2">
          <Text className="text-base font-bold text-primary">
            Eventos Organizados ({organizedEvents.length})
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
        data={organizedEvents}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
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

          const priceLabel = item.isFreeEvent
            ? "Gratis"
            : item.price
              ? `S/ ${item.price}`
              : "S/ 45";

          return (
            <UserOrganizedEventCard
              id={item.id}
              title={item.title}
              location={item.location}
              dateBadge={formatDateProfile(item.startAt) || "HOY · 20:00"}
              priceLabel={priceLabel}
              image={imageSource}
              isOwner={true}
              onPressDetails={() =>
                router.push(`/(events)/${item.id}` as Href)
              }
              onPressContact={handleContact}
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
