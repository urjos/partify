import { MUSIC_TYPES } from "@/constants/categories";
import { colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";

interface MusicTypeSelectorProps {
  selected: string[];
  onChange: (selected: string[]) => void;
}

export default function MusicTypeSelector({
  selected,
  onChange,
}: MusicTypeSelectorProps) {
  const [modalVisible, setModalVisible] = useState(false);

  const toggleGenre = (genre: string) => {
    if (selected.includes(genre)) {
      onChange(selected.filter((g) => g !== genre));
    } else {
      onChange([...selected, genre]);
    }
  };

  const removeGenre = (genre: string) => {
    onChange(selected.filter((g) => g !== genre));
  };

  return (
    <View className="mt-4">
      {/* Fila superior: Título y Selector "Elige ⌵" */}
      <View className="flex-row items-center justify-between">
        <Text className="text-sm font-semibold text-primary">
          Género Musical Principal
        </Text>
        <Pressable
          onPress={() => setModalVisible(true)}
          className="flex-row items-center px-3 py-1.5 bg-card rounded-full border border-border active:opacity-75"
        >
          <Text className="text-xs font-medium text-primary mr-1">
            {selected.length > 0 ? `${selected.length} elegidos` : "Elige"}
          </Text>
          <Ionicons
            name="chevron-down"
            size={14}
            color={colors.mutedForeground}
          />
        </Pressable>
      </View>

      {/* Chips seleccionados debajo */}
      {selected.length > 0 && (
        <View className="flex-row flex-wrap gap-2 mt-3">
          {selected.map((genre) => (
            <View
              key={genre}
              className="flex-row items-center px-3 py-1.5 bg-card rounded-full border border-border"
            >
              <Ionicons
                name="musical-note"
                size={12}
                color={colors.accentPink}
                style={{ marginRight: 4 }}
              />
              <Text className="text-xs font-medium text-primary mr-2">
                {genre}
              </Text>
              <Pressable
                onPress={() => removeGenre(genre)}
                hitSlop={6}
                className="size-4 items-center justify-center rounded-full bg-muted"
              >
                <Ionicons name="close" size={10} color={colors.primary} />
              </Pressable>
            </View>
          ))}
        </View>
      )}

      {/* Modal para selección múltiple */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          onPress={() => setModalVisible(false)}
          className="flex-1 bg-black/60 items-center justify-center p-4"
        >
          <Pressable
            onPress={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-modal-background border border-border rounded-2xl p-5 max-h-[80%]"
          >
            <View className="flex-row items-center justify-between pb-3 border-b border-border">
              <View>
                <Text className="text-primary font-semibold text-lg">
                  Géneros Musicales
                </Text>
                <Text className="text-muted-foreground text-xs">
                  Selecciona uno o más géneros
                </Text>
              </View>
              <Pressable
                onPress={() => setModalVisible(false)}
                className="p-1.5 rounded-full bg-card"
              >
                <Ionicons name="close" size={16} color={colors.primary} />
              </Pressable>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              className="py-3"
              contentContainerClassName="flex-row flex-wrap gap-2"
            >
              {MUSIC_TYPES.map((genre) => {
                const isSelected = selected.includes(genre);
                return (
                  <Pressable
                    key={genre}
                    onPress={() => toggleGenre(genre)}
                    className={
                      isSelected
                        ? "flex-row items-center px-3.5 py-2 rounded-full bg-accent-pink/20 border border-accent-pink"
                        : "flex-row items-center px-3.5 py-2 rounded-full bg-card border border-border"
                    }
                  >
                    {isSelected && (
                      <Ionicons
                        name="checkmark"
                        size={14}
                        color={colors.accentPink}
                        style={{ marginRight: 4 }}
                      />
                    )}
                    <Text
                      className={
                        isSelected
                          ? "text-xs font-semibold text-accent-pink"
                          : "text-xs font-medium text-primary"
                      }
                    >
                      {genre}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            <Pressable
              onPress={() => setModalVisible(false)}
              className="w-full bg-accent-pink py-3 rounded-xl items-center justify-center mt-3 active:opacity-85"
            >
              <Text className="text-white font-semibold text-sm">
                Listo ({selected.length} seleccionados)
              </Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
