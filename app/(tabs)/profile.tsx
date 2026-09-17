import Header from "@/components/home/Header";
import ProfileEventCard from "@/components/profile/ProfileEventCard";
import ProfileHeroCard from "@/components/profile/ProfileHeroCard";
import ProfilePreferences from "@/components/profile/ProfilePreferences";
import ProfileSegmentedTabs, {
  ProfileTab,
} from "@/components/profile/ProfileSegmentedTabs";
import ProfileSpotifyCard from "@/components/profile/ProfileSpotifyCard";
import ProfileStats from "@/components/profile/ProfileStats";
import images from "@/constants/images";
import { useApi } from "@/hooks/use-api";
import { useEventStore } from "@/lib/store/eventStore";
import { ProfileEventItem, useUserStore } from "@/lib/store/userStore";
import { formatDateProfile } from "@/lib/utils";
import { openWhatsApp } from "@/lib/whatsapp";
import { useClerk, useUser } from "@clerk/expo";
import { router, type Href } from "expo-router";
import { styled } from "nativewind";
import { usePostHog } from "posthog-react-native";
import React, { useMemo, useState } from "react";
import { Alert, FlatList, Linking, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

const getEventImage = (event: EventItem) => {
  const firstMedia = event.media?.[0];
  if (!firstMedia) return images.noriel;
  if ("source" in firstMedia && firstMedia.source) return firstMedia.source;
  if ("uri" in firstMedia && firstMedia.uri) return { uri: firstMedia.uri };
  return images.noriel;
};

const Profile = () => {
  const { signOut } = useClerk();
  const { user } = useUser();
  const posthog = usePostHog();
  const api = useApi();

  const userProfile = useUserStore((state) => state.profile);
  const fetchProfile = useUserStore((state) => state.fetchProfile);

  const events = useEventStore((state) => state.events);
  const fetchEvents = useEventStore((state) => state.fetchEvents);
  const loading = useEventStore((state) => state.loading);

  React.useEffect(() => {
    fetchProfile(api);
  }, [api, fetchProfile]);

  const [activeTab, setActiveTab] = useState<ProfileTab>("favorites");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [contactEnabled, setContactEnabled] = useState(true);

  const displayName =
    userProfile.name ||
    user?.fullName ||
    user?.firstName ||
    user?.emailAddresses[0]?.emailAddress?.split("@")[0] ||
    "Mateo Silva";

  const userAvatar = userProfile.avatarUri
    ? { uri: userProfile.avatarUri }
    : user?.imageUrl
      ? { uri: user.imageUrl }
      : images.noriel;

  const favoriteEvents: ProfileEventItem[] = useMemo(() => {
    return events
      .filter((e) => Boolean(e.isFavorite))
      .map((e) => ({
        id: e.id,
        title: e.title,
        location: e.location,
        dateBadge: formatDateProfile(e.startAt),
        image: getEventImage(e),
        status: "favorited",
        statusLabel: "Guardada en Favoritos",
        contactPhone: e.contactPhone,
        externalTicketUrl: e.externalTicketUrl,
        contactMethod: e.contactMethod,
      }));
  }, [events]);

  const historyEvents: ProfileEventItem[] = useMemo(() => {
    return events
      .filter((e) => Boolean(e.isGoing || e.isOwner))
      .map((e) => ({
        id: e.id,
        title: e.title,
        location: e.location,
        dateBadge: formatDateProfile(e.startAt),
        image: getEventImage(e),
        status: e.isOwner ? "confirmed" : "approved",
        statusLabel: e.isOwner ? "Tu evento publicado" : "Pase Aprobado",
        contactPhone: e.contactPhone,
        externalTicketUrl: e.externalTicketUrl,
        contactMethod: e.contactMethod,
      }));
  }, [events]);

  const currentEvents =
    activeTab === "favorites" ? favoriteEvents : historyEvents;

  const organizedCount = events.filter((e) => Boolean(e.isOwner)).length;
  const attendedCount = events.filter((e) => Boolean(e.isGoing)).length;

  const handleSignOut = async () => {
    posthog.capture("user_signed_out");
    try {
      await signOut();
      posthog.reset();
    } catch (error) {
      console.error("Sign-out failed:", error);
    }
  };

  const handleEditProfile = () => {
    router.push(`/(user)/edit/${user?.id || "me"}` as Href);
  };

  const handleContactOrganizer = (item: ProfileEventItem) => {
    if (item.contactMethod === "external" && item.externalTicketUrl) {
      Linking.openURL(item.externalTicketUrl).catch(() => {});
    } else if (item.contactPhone) {
      openWhatsApp(item.contactPhone, item.title);
    } else {
      Alert.alert(
        "Contactar Anfitrión",
        `Iniciando canal de comunicación para "${item.title}".`,
      );
    }
  };

  const hasPhone = Boolean(
    userProfile.phone && userProfile.phone.trim().length > 0,
  );

  const handleContactToggle = (enabled: boolean) => {
    if (!hasPhone) {
      setContactEnabled(false);
      return;
    }
    setContactEnabled(enabled);
  };

  const renderListHeader = () => (
    <View className="gap-5">
      {/* Título de la pantalla */}
      <Header title="Profile" isPressable={false} />

      {/* Tarjeta de Identidad (Hero) */}
      <ProfileHeroCard
        name={displayName}
        avatarSource={userAvatar}
        bio={userProfile.bio}
        isVerified={true}
        socials={userProfile.socials}
        onEditPress={handleEditProfile}
      />

      {/* Tarjeta de Playlist de Spotify (si está configurada) */}
      {userProfile.spotifyPlaylist ? (
        <ProfileSpotifyCard
          playlistUrl={userProfile.spotifyPlaylist}
          onEditPress={handleEditProfile}
        />
      ) : null}

      {/* Tarjetas de Estadísticas y Acción */}
      <ProfileStats
        rating={4.9}
        attendedCount={attendedCount}
        organizedCount={organizedCount}
      />

      {/* Selector de Pestañas (Favoritos / Historial) */}
      <ProfileSegmentedTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Título de la Sección de Eventos */}
      <View className="flex-row items-center justify-between mb-5">
        <Text className="text-medium font-bold text-primary">
          {activeTab === "favorites" ? "Favoritos" : "Historial"} (
          {currentEvents.length})
        </Text>
      </View>
    </View>
  );

  const renderListFooter = () => (
    <ProfilePreferences
      notificationsEnabled={notificationsEnabled}
      contactEnabled={hasPhone && contactEnabled}
      contactDisabled={!hasPhone}
      onToggleContact={handleContactToggle}
      onToggleNotifications={setNotificationsEnabled}
      onSignOut={handleSignOut}
    />
  );

  return (
    <SafeAreaView
      edges={["top", "left", "right"]}
      className="flex-1 bg-background page-all"
    >
      <FlatList
        data={currentEvents}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProfileEventCard
            item={item}
            onPress={() => router.push(`/(events)/${item.id}`)}
            onContact={() => handleContactOrganizer(item)}
          />
        )}
        ListHeaderComponent={renderListHeader}
        ListFooterComponent={renderListFooter}
        ItemSeparatorComponent={() => <View className="h-5" />}
        showsVerticalScrollIndicator={false}
        onRefresh={() => {
          fetchEvents(api);
          fetchProfile(api);
        }}
        refreshing={loading}
        ListEmptyComponent={
          <View className="bg-modal-background rounded-2xl p-4 items-center justify-center">
            <Text className="text-xs font-medium text-muted-foreground">
              {activeTab === "favorites"
                ? "No tienes eventos guardados en tus favoritos aún. ¡Toca el corazón en cualquier evento para guardarlo!"
                : "No tienes eventos en tu historial aún."}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default Profile;
