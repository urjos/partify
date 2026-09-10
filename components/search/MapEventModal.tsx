import { icons } from "@/constants/icons";
import images from "@/constants/images";
import { colors } from "@/constants/theme";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Image,
  Modal,
  Pressable,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";

interface MapEventModalProps {
  event: any; // EventItem
  visible: boolean;
  onClose: () => void;
  onDetailsPress: (id: string) => void;
  onContactPress?: () => void;
}

export default function MapEventModal({
  event,
  visible,
  onClose,
  onDetailsPress,
  onContactPress,
}: MapEventModalProps) {
  const { height } = Dimensions.get("window");
  const slideAnim = useRef(new Animated.Value(height)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      slideAnim.setValue(height);
    }
  }, [visible, slideAnim, height]);

  const handleClose = () => {
    Animated.timing(slideAnim, {
      toValue: height,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      onClose();
    });
  };

  if (!event) return null;

  const formattedDateTime = event.dateLabel
    ? `${dayjs(event.startAt).format("D [de] MMMM")} • ${dayjs(event.startAt).format("h:mm a")}`
    : "Sin fecha";

  const locationText =
    event.location?.split(",").slice(-2, -1)[0]?.trim() ||
    event.location ||
    "Av. Larco 850, Miraflores";

  const imageUrl =
    event.media && event.media.length > 0 && event.media[0].type === "image"
      ? event.media[0].source
      : undefined;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={handleClose}>
        <View
          className="map-modal-overlay"
          style={{ backgroundColor: colors.BackgroundModal }}
        >
          <TouchableWithoutFeedback onPress={() => {}}>
            <Animated.View
              className="map-modal-container"
              style={{ transform: [{ translateY: slideAnim }] }}
            >
              <View className="map-modal-handle-wrap">
                <View className="map-modal-handle" />
              </View>

              <View className="map-modal-card">
                <View className="map-modal-image-wrap">
                  {imageUrl ? (
                    <Image
                      source={imageUrl}
                      className="map-modal-image"
                      resizeMode="cover"
                    />
                  ) : (
                    <View className="map-modal-image" />
                  )}

                  <LinearGradient
                    colors={[
                      "transparent",
                      "rgba(30,30,35,0.8)",
                      colors.modalBackground,
                    ]}
                    locations={[0.6, 1, 1]}
                    className="map-modal-overlay-gradient"
                    pointerEvents="none"
                  />

                  <View className="map-modal-badges">
                    <View className="map-modal-badge">
                      <Text className="map-modal-badge-text">
                        {event.category || "Rooftop"}
                      </Text>
                    </View>
                  </View>
                </View>

                <View className="map-modal-content">
                  <Text className="map-modal-event-title" numberOfLines={1}>
                    {event.title}
                  </Text>

                  <View className="map-modal-subtitle-row">
                    <View className="map-modal-subtitle-group">
                      <Image
                        source={
                          event.authorAvatar && event.authorAvatar.length > 0
                            ? { uri: event.authorAvatar }
                            : images.avatar
                        }
                        className="map-modal-host-avatar"
                      />
                      <View className="map-modal-host-info">
                        <Text className="map-modal-host-name">
                          {event.author || "Usuario"}
                        </Text>
                        <Image
                          source={icons.verified}
                          className="map-modal-verified-icon"
                          tintColor={colors.accentPink}
                          resizeMode="contain"
                        />
                      </View>
                    </View>

                    <View className="map-modal-subtitle-group">
                      <Image
                        source={icons.mapPin}
                        className="map-modal-icon-small"
                        tintColor={colors.mutedForeground}
                        resizeMode="contain"
                      />
                      <Text
                        className="map-modal-subtitle-text"
                        numberOfLines={1}
                      >
                        {locationText}
                      </Text>
                    </View>
                  </View>

                  <View className="map-modal-actions">
                    <Pressable
                      className="map-modal-btn-contact"
                      onPress={() => {
                        if (onContactPress) {
                          handleClose();
                          onContactPress();
                        }
                      }}
                    >
                      <Image
                        source={icons.messageSquareText}
                        className="size-4"
                        tintColor={colors.primary}
                        resizeMode="contain"
                      />
                      <Text className="map-modal-btn-contact-text">
                        Contactar
                      </Text>
                    </Pressable>

                    <Pressable
                      className="map-modal-btn-details"
                      onPress={() => {
                        handleClose();
                        onDetailsPress(event.id);
                      }}
                    >
                      <Text className="map-modal-btn-details-text">
                        Ver detalles
                      </Text>
                      <Image
                        source={icons.right}
                        className="size-4"
                        tintColor={colors.modalBackground}
                        resizeMode="contain"
                      />
                    </Pressable>
                  </View>
                </View>
              </View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
