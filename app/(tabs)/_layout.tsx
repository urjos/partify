import { tabs } from "@/constants/data";
import { useAuth } from "@clerk/expo";
import clsx from "clsx";
import { Redirect, Tabs } from "expo-router";
import { Image, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TabLayout = () => {
  const { isSignedIn, isLoaded } = useAuth();
  const insets = useSafeAreaInsets();

  // Wait for auth to load before rendering anything
  if (!isLoaded) {
    return null;
  }

  // Redirect to sign-in if user is not authenticated
  if (!isSignedIn) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: "#ffffff",
        tabBarInactiveTintColor: "rgba(245, 244, 242, 0.42)",
        tabBarStyle: {
          backgroundColor: "#0b0b0f",
          borderTopWidth: 0,
          height: 60 + insets.bottom,
          marginTop: 0,
          marginBottom: 0,
          paddingTop: 2,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 6,
          elevation: 0,
        },
        tabBarItemStyle: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 2,
        },
        tabBarIconStyle: {
          marginBottom: 1,
        },
      }}
    >
      {tabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ focused }) => (
              <Image
                source={tab.icon}
                resizeMode="contain"
                style={{
                  tintColor: focused ? "#ffffff" : "rgba(245, 244, 242, 0.42)",
                  width: 20,
                  height: 20,
                }}
              />
            ),
            tabBarLabel: ({ focused, color }) => (
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{ color }}
                className={clsx(
                  "text-[11px] text-center",
                  focused ? "font-sans-semibold" : "font-sans-medium",
                )}
              >
                {tab.title}
              </Text>
            ),
          }}
        />
      ))}
      <Tabs.Screen
        name="create"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
};

export default TabLayout;
