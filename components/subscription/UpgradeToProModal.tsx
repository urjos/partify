import { icons } from "@/constants/icons";
import { colors } from "@/constants/theme";
import { useBilling } from "@/hooks/use-billing";
import { LinearGradient } from "expo-linear-gradient";
import {
  AlertCircle,
  Headphones,
  Infinity as InfinityIcon,
  X,
  Zap,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

export interface UpgradeToProModalProps {
  visible: boolean;
  onClose: () => void;
  reason?: "limit_reached" | "feature_locked" | "general";
  currentActiveEvents?: number;
}

interface ProBenefitItem {
  id: string;
  title: string;
  description: string;
  iconType: "verified_image" | "lucide";
  lucideIcon?: React.ComponentType<{ size?: number; color?: string }>;
}

const PRO_BENEFITS: ProBenefitItem[] = [
  {
    id: "unlimited_events",
    title: "Eventos Ilimitados",
    description:
      "Publica y gestiona simultáneamente todas las fiestas que quieras sin limite.",
    iconType: "lucide",
    lucideIcon: InfinityIcon,
  },
  {
    id: "event_boost",
    title: "Impulso Semanal",
    description:
      "Destaca 1 evento por semana en la parte superior del feed 'Cerca de ti' por 24 horas.",
    iconType: "lucide",
    lucideIcon: Zap,
  },
  {
    id: "verified_badge",
    title: "Insignia de Verificación Pro",
    description:
      "Muestra el sello oficial de anfitrión verificado en tus eventos y perfil.",
    iconType: "verified_image",
  },
  {
    id: "priority_support",
    title: "Soporte Prioritario",
    description:
      "Atención preferencial y asistencia técnica rápida sin demoras.",
    iconType: "lucide",
    lucideIcon: Headphones,
  },
];

export const UpgradeToProModal: React.FC<UpgradeToProModalProps> = ({
  visible,
  onClose,
  reason = "general",
  currentActiveEvents,
}) => {
  const { openBillingPortal } = useBilling();
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    try {
      setLoading(true);
      await openBillingPortal();
    } catch (error) {
      Alert.alert(
        "No se pudo abrir el portal",
        error instanceof Error
          ? error.message
          : "Verifica tu conexión a internet e inténtalo de nuevo.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center px-4 bg-black/75">
        <Pressable
          className="absolute inset-0"
          onPress={onClose}
          accessibilityLabel="Cerrar modal"
        />

        <View className="w-full max-h-[80%] bg-modal-background rounded-3xl p-5 shadow-2xl">
          {/* Header Bar */}
          <View className="flex-row self-end">
            <Pressable
              onPress={onClose}
              hitSlop={12}
              className="size-8 items-center justify-center rounded-full bg-white/10 active:opacity-70"
            >
              <X size={18} color="#f5f4f2" />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} className="grow-0">
            {/* Banner si alcanzó el límite */}
            {reason === "limit_reached" && (
              <View className="flex-row items-center gap-2.5 p-3.5 mb-4 rounded-2xl ">
                <AlertCircle size={20} color={colors.delete} />
                <View className="flex-1">
                  <Text className="text-delete font-bold text-sm">
                    Límite del Plan Free alcanzado
                  </Text>
                  <Text className="text-muted-foreground text-xs font-medium">
                    {currentActiveEvents !== undefined
                      ? `Tienes ${currentActiveEvents} de 2 eventos activos simultáneos.`
                      : "Solo puedes tener hasta 2 eventos activos simultáneamente en el Plan Free."}{" "}
                    Pásate a Pro para publicar eventos ilimitados.
                  </Text>
                </View>
              </View>
            )}

            {/* Title & Subtitle */}
            <View className="items-center text-center my-2">
              <Text className="text-2xl font-extrabold text-white text-center">
                Lleva tus fiestas al siguiente nivel
              </Text>
              <Text className="text-sm font-regular text-white/60 text-center mt-2 px-2">
                Herramientas exclusivas para anfitriones y promotores. Cero
                comisiones en venta de entradas.
              </Text>
            </View>

            {/* Benefits List */}
            <View className="gap-2.5 my-4">
              {PRO_BENEFITS.map((benefit) => {
                const IconComponent = benefit.lucideIcon;
                return (
                  <View
                    key={benefit.id}
                    className="flex-row items-center gap-3 p-3 rounded-2xl"
                  >
                    <View className="size-10 rounded-xl bg-white/5 items-center justify-center mt-0.5">
                      {benefit.iconType === "verified_image" ? (
                        <Image
                          source={icons.verified}
                          className="size-5"
                          resizeMode="contain"
                          tintColor={colors.accentPink}
                        />
                      ) : IconComponent ? (
                        <IconComponent size={20} color={colors.accentPink} />
                      ) : null}
                    </View>

                    <View className="flex-1">
                      <Text className="text-base font-bold text-white">
                        {benefit.title}
                      </Text>
                      <Text className="text-xs text-white/60 mt-0.5 leading-4">
                        {benefit.description}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </ScrollView>

          {/* Action CTA Button */}
          <View className="pt-3 gap-2.5">
            <Pressable
              onPress={handleUpgrade}
              disabled={loading}
              className="active:opacity-85 overflow-hidden rounded-2xl"
            >
              <LinearGradient
                colors={["#ea4bc8", "#b24bfb"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="py-4 items-center justify-center flex-row gap-2"
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <Text className="text-white font-extrabold text-base tracking-wide">
                    Mejorar a Partify Pro - $5.99/mes
                  </Text>
                )}
              </LinearGradient>
            </Pressable>

            <Pressable
              onPress={onClose}
              disabled={loading}
              className="py-2.5 items-center justify-center active:opacity-60"
            >
              <Text className="text-muted-foreground font-medium text-xs">
                Tal vez más tarde
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default UpgradeToProModal;
