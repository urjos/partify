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
      "Publica y gestiona simultáneamente todas las fiestas que quieras sin el tope de 2 eventos activos.",
    iconType: "lucide",
    lucideIcon: InfinityIcon,
  },
  {
    id: "event_boost",
    title: "Impulso Semanal",
    description:
      "Destaca 1 evento por semana en la parte superior del feed 'Cerca de ti' por 24 horas para maximizar asistentes.",
    iconType: "lucide",
    lucideIcon: Zap,
  },
  {
    id: "verified_badge",
    title: "Insignia de Verificación Pro",
    description:
      "Muestra el sello oficial de anfitrión verificado en tus eventos y perfil para construir credibilidad.",
    iconType: "verified_image",
  },
  {
    id: "priority_support",
    title: "Soporte Prioritario",
    description:
      "Atención preferencial y asistencia técnica rápida para coordinar tus listas y accesos sin demoras.",
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

        <View className="w-full max-h-[88%] bg-[#0c0c0c] border border-white/10 rounded-3xl p-5 shadow-2xl">
          {/* Header Bar */}
          <View className="flex-row items-center justify-between pb-3">
            <View className="flex-row items-center gap-2">
              <LinearGradient
                colors={["#ea4bc8", "#b24bfb"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="px-3 py-1 rounded-full"
              >
                <Text className="text-white text-xs font-extrabold tracking-wider">
                  PARTIFY PRO
                </Text>
              </LinearGradient>
            </View>

            <Pressable
              onPress={onClose}
              hitSlop={12}
              className="size-8 items-center justify-center rounded-full bg-white/10 active:opacity-70"
            >
              <X size={18} color="#f5f4f2" />
            </Pressable>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            className="flex-grow-0"
          >
            {/* Banner si alcanzó el límite */}
            {reason === "limit_reached" && (
              <View className="flex-row items-start gap-2.5 p-3.5 mb-4 rounded-2xl bg-amber-500/10 border border-amber-500/30">
                <AlertCircle size={20} color="#f59e0b" />
                <View className="flex-1">
                  <Text className="text-amber-400 font-bold text-sm">
                    Límite del Plan Free alcanzado
                  </Text>
                  <Text className="text-amber-200/80 text-xs mt-0.5">
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
              <Text className="text-2xl font-black text-white text-center">
                Lleva tus fiestas al siguiente nivel
              </Text>
              <Text className="text-sm text-white/60 text-center mt-2 px-2">
                Herramientas exclusivas para anfitriones y promotores.
                Cero comisiones en venta de entradas.
              </Text>
            </View>

            {/* Benefits List */}
            <View className="gap-2.5 my-4">
              {PRO_BENEFITS.map((benefit) => {
                const IconComponent = benefit.lucideIcon;
                return (
                  <View
                    key={benefit.id}
                    className="flex-row items-start gap-3 p-3.5 rounded-2xl bg-[#1b1b1f] border border-white/5"
                  >
                    <View className="size-10 rounded-xl bg-[#241320] border border-[#ea4bc8]/30 items-center justify-center mt-0.5">
                      {benefit.iconType === "verified_image" ? (
                        <Image
                          source={icons.verified}
                          className="size-5"
                          resizeMode="contain"
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

            {/* Price Tag & Guarantees */}
            <View className="items-center py-2">
              <Text className="text-white/50 text-xs text-center">
                Cancela en cualquier momento desde tu cuenta
              </Text>
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
                    Upgrade to Partify Pro - $5.99/mo
                  </Text>
                )}
              </LinearGradient>
            </Pressable>

            <Pressable
              onPress={onClose}
              disabled={loading}
              className="py-2.5 items-center justify-center active:opacity-60"
            >
              <Text className="text-white/60 font-semibold text-sm">
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
