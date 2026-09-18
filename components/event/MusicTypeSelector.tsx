import { MUSIC_TYPES } from "@/constants/categories";
import { icons } from "@/constants/icons";
import { colors } from "@/constants/theme";
import React, { useState } from "react";
import { Image, Modal, Pressable, ScrollView, Text, View } from "react-native";

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
    <View className="gap-4">
      {/* Fila superior: Título y Selector "Elige ⌵" */}
      <View className="flex-row items-center justify-between">
        <Text className="text-xl font-bold text-primary">Género musical</Text>
        <Pressable
          onPress={() => setModalVisible(true)}
          className="flex-row items-center px-3 py-1.5 bg-modal-background rounded-full border-none active:opacity-75 gap-1"
        >
          <Text className="text-xs font-bold text-muted-foreground">
            {selected.length > 0 ? `${selected.length} elegidos` : "Elige"}
          </Text>
          <Image
            source={icons.chevronDown}
            className="size-5"
            tintColor={colors.mutedForeground}
          />
        </Pressable>
      </View>

      {/* Chips seleccionados debajo */}
      {selected.length > 0 && (
        <View className="flex-row flex-wrap gap-2">
          {selected.map((genre) => (
            <View
              key={genre}
              className="flex-row items-center px-5 py-2.5 bg-modal-background rounded-full border-none"
            >
              <Text className="text-sm font-semibold text-muted-foreground mr-2">
                {genre}
              </Text>
              <Pressable
                onPress={() => removeGenre(genre)}
                hitSlop={6}
                className="size-4 items-center justify-center rounded-full"
              >
                <Image
                  source={icons.x}
                  className="size-4"
                  tintColor={colors.mutedForeground}
                />
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
            className="w-full max-w-sm bg-background rounded-2xl p-5 max-h-[80%]"
          >
            <View className="flex-row items-center justify-between pb-3 ">
              <View>
                <Text className="text-primary font-bold text-lg">
                  Géneros musicales
                </Text>
                <Text className="text-muted-foreground text-xs font-medium">
                  Selecciona uno o más géneros
                </Text>
              </View>
              <Pressable
                onPress={() => setModalVisible(false)}
                className="size-8 rounded-full items-center justify-center"
              >
                <Image
                  source={icons.x}
                  className="size-6"
                  tintColor={colors.primary}
                />
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
                        ? "flex-row items-center px-3.5 py-2 rounded-full bg-chip-background"
                        : "flex-row items-center px-3.5 py-2 rounded-full bg-submodal-background"
                    }
                  >
                    {isSelected && (
                      <Image
                        source={icons.audioLines}
                        className="size-4"
                        tintColor={colors.accentPink}
                        style={{ marginRight: 4 }}
                      />
                    )}
                    <Text
                      className={
                        isSelected
                          ? "text-xs font-bold text-accent-pink"
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
              <Text className="text-white font-semibold text-sm">Listo</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
