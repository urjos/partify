import HorizontalChips from "@/components/shared/HorizontalChips";
import { DRESS_CATEGORIES } from "@/constants/categories";
import { colors } from "@/constants/theme";
import React from "react";
import { Text, TextInput, View } from "react-native";

const DRESS_CATEGORY_ITEMS = DRESS_CATEGORIES.map((cat) => ({
  id: cat,
  label: cat,
}));

const MAX_DETAILS_LENGTH = 40;

interface DressCodeSectionProps {
  dressCode: string;
  onDressCodeChange: (val: string) => void;
  dressCodeDetails: string;
  onDressCodeDetailsChange: (val: string) => void;
}

export default function DressCodeSection({
  dressCode,
  onDressCodeChange,
  dressCodeDetails,
  onDressCodeDetailsChange,
}: DressCodeSectionProps) {
  const currentLength = dressCodeDetails.length;

  return (
    <View className="gap-4">
      {/* Encabezado de la sección */}
      <View className="flex-row items-center justify-between">
        <Text className="text-xl font-bold text-primary">
          Código de vestimenta
        </Text>
      </View>

      {/* Selector de categorías con Chips Horizontales */}
      <HorizontalChips
        items={DRESS_CATEGORY_ITEMS}
        selected={dressCode}
        onSelect={onDressCodeChange}
      />

      {/* Input opcional con límite estricto de 50 caracteres */}
      <View className="gap-2">
        <TextInput
          className="bg-modal-background text-primary text-sm font-regular p-3 rounded-xl border-none"
          placeholder="Ej. No zapatillas deportivas..."
          placeholderTextColor={colors.mutedForeground}
          value={dressCodeDetails}
          onChangeText={onDressCodeDetailsChange}
          maxLength={MAX_DETAILS_LENGTH}
        />

        <View className="flex-row items-center justify-between">
          <Text className="text-xs text-muted-foreground font-regular">
            Opcional
          </Text>
          <Text
            className={`text-xs font-bold ${
              currentLength >= MAX_DETAILS_LENGTH
                ? "text-accent-pink font-bold"
                : "text-muted-foreground"
            }`}
          >
            {currentLength}/{MAX_DETAILS_LENGTH}
          </Text>
        </View>
      </View>
    </View>
  );
}
