import { icons } from "@/constants/icons";
import { colors } from "@/constants/theme";
import React, { useEffect, useMemo, useState } from "react";
import {
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

const LIMA_DISTRICTS: PlacePrediction[] = [
  "Ancón",
  "Ate",
  "Barranco",
  "Breña",
  "Carabayllo",
  "Chaclacayo",
  "Chorrillos",
  "Cieneguilla",
  "Comas",
  "El Agustino",
  "Independencia",
  "Jesús María",
  "La Molina",
  "La Victoria",
  "Lima (Cercado)",
  "Lince",
  "Los Olivos",
  "Lurigancho-Chosica",
  "Lurín",
  "Magdalena del Mar",
  "Miraflores",
  "Pachacámac",
  "Pucusana",
  "Pueblo Libre",
  "Puente Piedra",
  "Punta Hermosa",
  "Punta Negra",
  "Rímac",
  "San Bartolo",
  "San Borja",
  "San Isidro",
  "San Juan de Lurigancho",
  "San Juan de Miraflores",
  "San Luis",
  "San Martín de Porres",
  "San Miguel",
  "Santa Anita",
  "Santa María del Mar",
  "Santa Rosa",
  "Santiago de Surco",
  "Surquillo",
  "Villa El Salvador",
  "Villa María del Triunfo",
].map((district) => ({
  placeId: `lima-${district.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
  mainText: district,
  secondaryText: "Lima, Perú",
  fullText: `${district}, Lima`,
}));

const normalizeSearchText = (text: string) =>
  text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase();

export default function LocationSearchModal({
  visible,
  currentLocation = "",
  onClose,
  onSelectLocation,
}: LocationSearchModalProps) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (visible) {
      setQuery("");
    }
  }, [visible]);

  const districts = useMemo(() => {
    const searchTerm = normalizeSearchText(query.trim());
    if (!searchTerm) return LIMA_DISTRICTS;

    return LIMA_DISTRICTS.filter((district) =>
      normalizeSearchText(district.mainText).includes(searchTerm),
    );
  }, [query]);

  const handleSelect = (item: PlacePrediction) => {
    onSelectLocation(item.fullText);
    onClose();
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

          {/* Filtro local de distritos */}
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
              placeholder="Buscar distrito de Lima..."
              placeholderTextColor={colors.mutedForeground}
              autoFocus
              autoCorrect={false}
              returnKeyType="done"
            />
            {Boolean(query) && (
              <Pressable onPress={() => setQuery("")} hitSlop={8}>
                <Image
                  source={icons.x}
                  className="size-3.5"
                  tintColor={colors.mutedForeground}
                />
              </Pressable>
            )}
          </View>

          {/* Lista de distritos */}
          <FlatList
            data={districts}
            keyExtractor={(item) => item.placeId}
            keyboardShouldPersistTaps="always"
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              <Text className="text-xs font-medium text-muted-foreground mb-4">
                {query.trim() ? "Resultados" : "Distritos de Lima"}
              </Text>
            }
            ListEmptyComponent={
              query.trim() ? (
                <View className="items-center justify-center py-8 gap-3">
                  <Text className="text-sm font-medium text-muted-foreground text-center">
                    {`No se encontraron distritos para "${query}".`}
                  </Text>
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
