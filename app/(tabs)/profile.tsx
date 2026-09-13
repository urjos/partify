import Header from "@/components/home/Header";
import ProfileEventCard, {
  ProfileEventItem,
} from "@/components/profile/ProfileEventCard";
import ProfileHeroCard from "@/components/profile/ProfileHeroCard";
import ProfilePreferences from "@/components/profile/ProfilePreferences";
import ProfileSegmentedTabs, {
  ProfileTab,
} from "@/components/profile/ProfileSegmentedTabs";
import ProfileStats from "@/components/profile/ProfileStats";
import images from "@/constants/images";
import { useClerk, useUser } from "@clerk/expo";
import { styled } from "nativewind";
import { usePostHog } from "posthog-react-native";
import React, { useState } from "react";
import { Alert, FlatList, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

const MOCK_HISTORY_EVENTS: ProfileEventItem[] = [
  {
    id: "hist-1",
    title: "Sunset Rooftop Barranco",
    location: "Malecón Paul Harris, Barranco",
    dateBadge: "Hoy · 20:00",
    image: images.noriel,
    status: "approved",
    statusLabel: "Pase Aprobado",
  },
  {
    id: "hist-2",
    title: "Underground Penthouse #04",
    location: "Av. Pardo, Miraflores, Lima",
    dateBadge: "Sábado 21 · 23:00",
    image: images.darkiel,
    status: "confirmed",
    statusLabel: "Reserva confirmada",
  },
];

const MOCK_FAVORITE_EVENTS: ProfileEventItem[] = [
  {
    id: "fav-1",
    title: "Sunset Rooftop Barranco",
    location: "Malecón Paul Harris, Barranco",
    dateBadge: "Hoy · 20:00",
    image: images.noriel,
    status: "approved",
    statusLabel: "Pase Aprobado",
  },
];

const Profile = () => {
  const { signOut } = useClerk();
  const { user } = useUser();
  const posthog = usePostHog();

  const [activeTab, setActiveTab] = useState<ProfileTab>("history");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const displayName =
    user?.fullName ||
    user?.firstName ||
    user?.emailAddresses[0]?.emailAddress?.split("@")[0] ||
    "Mateo Silva";

  const userAvatar = user?.imageUrl ? { uri: user.imageUrl } : images.noriel;

  const currentEvents =
    activeTab === "history" ? MOCK_HISTORY_EVENTS : MOCK_FAVORITE_EVENTS;

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
    Alert.alert(
      "Editar Perfil",
      "La edición de perfil estará disponible en la próxima actualización.",
    );
  };

  const handleContactOrganizer = (eventTitle: string) => {
    Alert.alert(
      "Contactar Anfitrión",
      `Iniciando canal de comunicación para "${eventTitle}".`,
    );
  };

  const renderListHeader = () => (
    <View className="gap-5">
      {/* Título de la pantalla */}
      <Header title="Profile" isPressable={false} />

      {/* Tarjeta de Identidad (Hero) */}
      <ProfileHeroCard
        name={displayName}
        avatarSource={userAvatar}
        isVerified={true}
      />

      {/* Tarjetas de Estadísticas y Acción */}
      <ProfileStats
        rating={4.9}
        attendedCount={14}
        organizedCount={3}
        onEditPress={handleEditProfile}
      />

      {/* Selector de Pestañas (Favoritas / Historial) */}
      <ProfileSegmentedTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Título de la Sección de Eventos */}
      <View className="flex-row items-center justify-between mb-5">
        <Text className="text-base font-sans-bold text-primary">
          Eventos ({currentEvents.length})
        </Text>
      </View>
    </View>
  );

  const renderListFooter = () => (
    <ProfilePreferences
      notificationsEnabled={notificationsEnabled}
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
            onPress={() => {}}
            onContact={() => handleContactOrganizer(item.title)}
          />
        )}
        ListHeaderComponent={renderListHeader}
        ListFooterComponent={renderListFooter}
        ItemSeparatorComponent={() => <View className="h-5" />}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View className="bg-card rounded-2xl p-6 items-center justify-center border border-border/20">
            <Text className="text-sm font-sans-medium text-muted-foreground text-center">
              No tienes eventos en esta sección aún.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default Profile;
