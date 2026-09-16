import { icons } from "@/constants/icons";
import { colors } from "@/constants/theme";
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
import Header from "../home/Header";

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

// Expo solo incorpora en el bundle las variables con el prefijo EXPO_PUBLIC_.
// Esta debe ser una clave de Google Maps restringida para la app, nunca una
// clave de servidor sin restricciones.
const GOOGLE_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

export default function LocationSearchModal({
  visible,
  currentLocation = "",
  onClose,
  onSelectLocation,
}: LocationSearchModalProps) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
  const [searchError, setSearchError] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      setQuery("");
      setPredictions([]);
      setSearchError(null);
    }
  }, [visible]);

  // Google Places Autocomplete API with debounce
  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed || trimmed.length < 2) {
      setPredictions([]);
      setLoading(false);
      setSearchError(null);
      return;
    }

    if (!GOOGLE_API_KEY) {
      setPredictions([]);
      setLoading(false);
      setSearchError("La búsqueda de ubicaciones no está configurada.");
      return;
    }

    setLoading(true);
    setSearchError(null);
    const timeoutId = setTimeout(async () => {
      try {
        const response = await fetch(
          "https://places.googleapis.com/v1/places:autocomplete",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Goog-Api-Key": GOOGLE_API_KEY,
            },
            body: JSON.stringify({
              input: trimmed,
              includedRegionCodes: ["pe"],
              languageCode: "es",
            }),
          },
        );

        const data = await response.json();

        if (response.ok && Array.isArray(data.suggestions)) {
          const mapped: PlacePrediction[] = data.suggestions
            .filter((s: any) => s.placePrediction)
            .map((s: any) => {
              const pred = s.placePrediction;
              return {
                placeId: pred.placeId || pred.place || Math.random().toString(),
                mainText:
                  pred.structuredFormat?.mainText?.text ||
                  pred.text?.text ||
                  trimmed,
                secondaryText: pred.structuredFormat?.secondaryText?.text || "",
                fullText: pred.text?.text || trimmed,
              };
            });
          setPredictions(mapped);
        } else if (data.error) {
          console.warn("Google Places API error:", data.error);
          setPredictions([]);
          const isBlocked =
            data.error.code === 403 ||
            data.error.status === "PERMISSION_DENIED" ||
            data.error.message?.includes("blocked");
          setSearchError(
            isBlocked
              ? "Debes habilitar 'Places API (New)' en Google Cloud Console para esta API Key."
              : data.error.message ||
                  "No se pudieron cargar las sugerencias de Google Maps.",
          );
        } else {
          setPredictions([]);
          setSearchError(null);
        }
      } catch (err) {
        console.warn("Google Places autocomplete error:", err);
        setPredictions([]);
        setSearchError("No se pudo conectar con Google Maps.");
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
      <View className="flex-1 bg-background page-all">
        <SafeAreaView edges={["top", "bottom"]} className="flex-1">
          {/* Header con botón cerrar y título */}
          <View className="flex-row items-center justify-between">
            <Header
              title="Buscar ubicación"
              isPressable={false}
              isIconClose={true}
              onClose={onClose}
            />
          </View>

          {/* Campo de búsqueda estilo Google Maps */}
          <View className="flex-row items-center bg-modal-background rounded-2xl px-3.5 py-2.5 gap-2.5 mb-4">
            <Image
              source={icons.mapPin}
              tintColor={colors.mutedForeground}
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
              <Text className="text-xs font-medium text-muted-foreground mb-4">
                {query.trim().length >= 2
                  ? "Resultados de Google Maps"
                  : "Ubicaciones sugeridas"}
              </Text>
            }
            ListEmptyComponent={
              !loading && query.trim().length >= 2 ? (
                <View className="items-center justify-center py-8 gap-3">
                  <Text className="text-sm font-medium text-muted-foreground text-center">
                    {searchError ||
                      `No se encontraron sugerencias para "${query}".`}
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
                  className={`flex-row items-center py-3.5 border-card active:opacity-75 ${
                    isSelected && "bg-card/40 rounded-xl"
                  }`}
                >
                  <View className="flex-1 px-4">
                    <Text className="text-sm font-bold text-primary">
                      {item.mainText}
                    </Text>
                    {Boolean(item.secondaryText) && (
                      <Text className="text-xs font-medium text-muted-foreground mt-0.5">
                        {item.secondaryText}
                      </Text>
                    )}
                  </View>
                </Pressable>
              );
            }}
          />
        </SafeAreaView>
      </View>
    </Modal>
  );
}
