import EventCard from "@/components/EventCard";
import ListHeading from "@/components/ListHeading";
import images from "@/constants/images";
import { MOCK_EVENTS } from "@/constants/mock-events";
import "@/global.css";
import { useUser } from "@clerk/expo";
import { router } from "expo-router";
import { styled } from "nativewind";
import { FlatList, Image, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
const SafeAreaView = styled(RNSafeAreaView);

export default function App() {
  const { user } = useUser();

  const displayName = user?.firstName || user?.fullName || "User";

  return (
    <SafeAreaView className="flex-1 bg-background page">
      <FlatList
        ListHeaderComponent={() => (
          <>
            <View className="home-header">
              <View className="home-user">
                <Image
                  source={
                    user?.imageUrl ? { uri: user.imageUrl } : images.avatar
                  }
                  className="home-avatar"
                />
                <View>
                  <Text className="home-greeting">Hey, {displayName}</Text>
                  <Text className="home-subgreeting">
                    What's happening nearby
                  </Text>
                </View>
              </View>
            </View>

            <ListHeading title="All Events" />
          </>
        )}
        data={MOCK_EVENTS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <EventCard
            {...item}
            onPress={() => router.push(`/(events)/${item.id}`)}
          />
        )}
        ItemSeparatorComponent={() => <View className="h-2" />}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text className="home-empty-state">
            No events nearby yet — be the first to post one.
          </Text>
        }
        contentContainerClassName="pb-30"
      />
    </SafeAreaView>
  );
}
