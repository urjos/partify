import AnimatedToggle from "@/components/shared/AnimatedToggle";
import React from "react";
import { Text, View } from "react-native";

interface EventFeaturesSectionProps {
  corkageFree: boolean;
  onCorkageFreeChange: (val: boolean) => void;
  openBar: boolean;
  onOpenBarChange: (val: boolean) => void;
  isAdultsOnly: boolean;
  onIsAdultsOnlyChange: (val: boolean) => void;
  requirePhysicalId: boolean;
  onRequirePhysicalIdChange: (val: boolean) => void;
}

export default function EventFeaturesSection({
  corkageFree,
  onCorkageFreeChange,
  openBar,
  onOpenBarChange,
  isAdultsOnly,
  onIsAdultsOnlyChange,
  requirePhysicalId,
  onRequirePhysicalIdChange,
}: EventFeaturesSectionProps) {
  return (
    <View className="gap-4">
      <Text className="text-xl font-bold text-primary">
        Beneficios y Requisitos
      </Text>

      <View className="gap-6 ">
        {/* ================= SECCIÓN BEBIDAS ================= */}

        {/* Corcho libre */}
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-3 flex-1 pr-3">
            <View className="flex-1">
              <Text className="text-sm font-semibold text-primary">
                Corcho libre
              </Text>
              <Text className="text-xs text-muted-foreground">
                Los asistentes pueden ingresar sus propias bebidas.
              </Text>
            </View>
          </View>
          <AnimatedToggle
            value={corkageFree}
            onValueChange={onCorkageFreeChange}
          />
        </View>

        {/* Barra libre */}
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-3 flex-1 pr-3">
            <View className="flex-1">
              <Text className="text-sm font-semibold text-primary">
                Barra libre
              </Text>
              <Text className="text-xs text-muted-foreground">
                Tragos o bebidas incluidas con la entrada/acceso.
              </Text>
            </View>
          </View>
          <AnimatedToggle value={openBar} onValueChange={onOpenBarChange} />
        </View>

        {/* Solo mayores de edad */}
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-3 flex-1 pr-3">
            <View className="flex-1">
              <Text className="text-sm font-semibold text-primary">
                Solo mayores de edad
              </Text>
              <Text className="text-xs text-muted-foreground">
                Ingreso estrictamente limitado a mayores de 18 años.
              </Text>
            </View>
          </View>
          <AnimatedToggle
            value={isAdultsOnly}
            onValueChange={onIsAdultsOnlyChange}
          />
        </View>

        {/* DNI físico */}
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-3 flex-1 pr-3">
            <View className="flex-1">
              <Text className="text-sm font-semibold text-primary">
                DNI físico obligatorio
              </Text>
              <Text className="text-xs text-muted-foreground">
                No se aceptarán fotos ni documentos digitales en puerta.
              </Text>
            </View>
          </View>
          <AnimatedToggle
            value={requirePhysicalId}
            onValueChange={onRequirePhysicalIdChange}
          />
        </View>
      </View>
    </View>
  );
}
