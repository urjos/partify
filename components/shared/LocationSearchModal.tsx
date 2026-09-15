import { icons } from "@/constants/icons";
import { colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface LocationSearchModalProps {
  visible: boolean;
  currentLocation?: string;
  onClose: () => void;
  onSelectLocation: (location: string) => void;
}

interface PlacePrediction {
  placeId: string;
  mainText: string;
  secondaryText: string;
  fullText: string;
}

const POPULAR_DISTRICTS: PlacePrediction[] = [
  {
    placeId: "dist-1",
    mainText: "Miraflores",
    secondaryText: "Lima, Perú",
    fullText: "Miraflores, Lima",
  },
  {
    placeId: "dist-2",
    mainText: "Barranco",
    secondaryText: "Lima, Perú",
    fullText: "Barranco, Lima",
  },
  {
    placeId: "dist-3",
    mainText: "San Isidro",
    secondaryText: "Lima, Perú",
    fullText: "San Isidro, Lima",
  },
  {
    placeId: "dist-4",
    mainText: "Santiago de Surco",
    secondaryText: "Lima, Perú",
    fullText: "Surco, Lima",
  },
  {
    placeId: "dist-5",
    mainText: "La Molina",
    secondaryText: "Lima, Perú",
    fullText: "La Molina, Lima",
  },
  {
    placeId: "dist-6",
    mainText: "San Miguel",
    secondaryText: "Lima, Perú",
    fullText: "San Miguel, Lima",
  },
];

const GOOGLE_API_KEY =
  process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ||
  process.env.GOOGLE_MAPS_API_KEY ||
  "AIzaSyCoD0pbkW2uzW6zq-R7WWbcqxUry9lbwYc";

export default function LocationSearchModal({
  visible,
  currentLocation = "",
  onClose,
  onSelectLocation,
}: LocationSearchModalProps) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);

  useEffect(() => {
    if (visible) {
      setQuery("");
      setPredictions([]);
    }
  }, [visible]);

  // Google Places Autocomplete API with debounce
  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed || trimmed.length < 2) {
      setPredictions([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const timeoutId = setTimeout(async () => {
      try {
        const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
          trimmed,
        )}&key=${GOOGLE_API_KEY}&components=country:pe&language=es&types=geocode|establishment`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.status === "OK" && Array.isArray(data.predictions)) {
          const mapped: PlacePrediction[] = data.predictions.map((p: any) => ({
            placeId: p.place_id,
            mainText: p.structured_formatting?.main_text || p.description,
            secondaryText: p.structured_formatting?.secondary_text || "",
            fullText: p.description,
          }));
          setPredictions(mapped);
        } else {
          setPredictions([]);
        }
      } catch (err) {
        console.warn("Google Places autocomplete error:", err);
        setPredictions([]);
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleSelect = (item: PlacePrediction) => {
    onSelectLocation(item.fullText);
    onClose();
  };

  const handleCustomConfirm = () => {
    if (query.trim()) {
      onSelectLocation(query.trim());
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, backgroundColor: colors.modalBackground }}>
        <SafeAreaView edges={["top", "bottom"]} className="flex-1 pafe-all">
          {/* Header con botón cerrar y título */}
          <View className="flex-row items-center justify-between pb-4">
            <Text className="text-xl font-bold text-primary">
              Buscar ubicación
            </Text>
            <Pressable
              onPress={onClose}
              hitSlop={10}
              className="size-9 rounded-full bg-card items-center justify-center active:opacity-75"
            >
              <Image
                source={icons.x}
                className="size-4"
                tintColor={colors.primary}
                resizeMode="contain"
              />
            </Pressable>
          </View>

          {/* Campo de búsqueda estilo Google Maps */}
          <View className="flex-row items-center bg-card rounded-2xl px-3.5 py-2.5 border border-card gap-2.5 mb-4">
            <Image
              source={icons.mapPin}
              tintColor={colors.accentPink}
              className="size-5"
              resizeMode="contain"
            />
            <TextInput
              className="flex-1 text-sm font-semibold text-primary"
              value={query}
              onChangeText={setQuery}
              placeholder="Buscar distrito, zona o dirección..."
              placeholderTextColor={colors.mutedForeground}
              autoFocus
              autoCorrect={false}
              returnKeyType="search"
              onSubmitEditing={handleCustomConfirm}
            />
            {loading && (
              <ActivityIndicator size="small" color={colors.accentPink} />
            )}
            {Boolean(query) && !loading && (
              <Pressable onPress={() => setQuery("")} hitSlop={8}>
                <Image
                  source={icons.x}
                  className="size-3.5"
                  tintColor={colors.mutedForeground}
                />
              </Pressable>
            )}
          </View>

          {/* Lista de Resultados / Sugerencias populares */}
          <FlatList
            data={query.trim().length >= 2 ? predictions : POPULAR_DISTRICTS}
            keyExtractor={(item) => item.placeId}
            keyboardShouldPersistTaps="always"
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              <Text className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                {query.trim().length >= 2
                  ? "Resultados de Google Maps"
                  : "Ubicaciones sugeridas"}
              </Text>
            }
            ListEmptyComponent={
              !loading && query.trim().length >= 2 ? (
                <View className="items-center justify-center py-8 gap-3">
                  <Text className="text-sm font-medium text-muted-foreground text-center">
                    No se encontraron sugerencias para "{query}".
                  </Text>
                  <Pressable
                    onPress={handleCustomConfirm}
                    className="px-4 py-2.5 rounded-xl bg-accent-pink/20 active:opacity-75"
                  >
                    <Text className="text-xs font-bold text-accent-pink">
                      Usar "{query}" como ubicación
                    </Text>
                  </Pressable>
                </View>
              ) : null
            }
            renderItem={({ item }) => {
              const isSelected =
                currentLocation.toLowerCase() === item.fullText.toLowerCase();

              return (
                <Pressable
                  onPress={() => handleSelect(item)}
                  className={`flex-row items-center py-3.5 border-b border-card active:opacity-75 ${
                    isSelected && "bg-card/40 rounded-xl px-2"
                  }`}
                >
                  <View className="size-8 rounded-full bg-modal-background items-center justify-center mr-3 border border-border/20">
                    <Image
                      source={icons.mapPin}
                      tintColor={
                        isSelected ? colors.accentPink : colors.mutedForeground
                      }
                      className="size-4"
                      resizeMode="contain"
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm font-bold text-primary">
                      {item.mainText}
                    </Text>
                    {Boolean(item.secondaryText) && (
                      <Text className="text-xs font-medium text-muted-foreground mt-0.5">
                        {item.secondaryText}
                      </Text>
                    )}
                  </View>
                  {isSelected && (
                    <Ionicons
                      name="checkmark"
                      size={18}
                      color={colors.accentPink}
                    />
                  )}
                </Pressable>
              );
            }}
          />
        </SafeAreaView>
      </View>
    </Modal>
  );
}
