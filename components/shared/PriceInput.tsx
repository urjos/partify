import { icons } from "@/constants/icons";
import { colors } from "@/constants/theme";
import { Image, Pressable, Text, TextInput, View } from "react-native";

interface PriceInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

function toNum(v: string): number {
  // Elimina el prefijo "S/ " si está presente antes de parsear
  const clean = v.replace(/^S\/\s*/, "").replace(",", ".");
  const n = parseFloat(clean);
  return isNaN(n) ? 0 : Math.max(0, n);
}

function fmt(n: number): string {
  // Enteros sin decimales (10 → "10"), decimales con 2 cifras (10.5 → "10.50")
  return n % 1 === 0 ? String(Math.round(n)) : n.toFixed(2);
}

export default function PriceInput({
  value,
  onChange,
  placeholder = "0",
}: PriceInputProps) {
  const num = toNum(value);
  const hasValue = value.trim() !== "";

  const displayValue = value;

  const handleChangeText = (text: string) => {
    const stripped = text.replace(/[^0-9.,]/g, "");
    onChange(stripped);
  };

  const handleBlur = () => {
    if (hasValue && num > 0) {
      onChange(fmt(num));
    } else {
      onChange("");
    }
  };

  const handleMinus = () => {
    const next = Math.max(0, num - 10);
    onChange(next > 0 ? fmt(next) : "");
  };

  const handlePlus = () => {
    onChange(fmt(num + 10));
  };

  return (
    <View className="flex-row items-center bg-card rounded-xl overflow-hidden">
      {/* Botón − */}
      <Pressable
        onPress={handleMinus}
        className="px-3 py-3 items-center justify-center"
        hitSlop={8}
      >
        <Image
          source={icons.minus}
          className="size-4"
          tintColor={num > 0 ? colors.primary : colors.mutedForeground}
          resizeMode="contain"
        />
      </Pressable>

      {/* Contenedor central del input */}
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            fontSize: 14,
            fontFamily: "sans-semibold",
            color: hasValue ? colors.primary : colors.mutedForeground,
            marginRight: 2,
          }}
        >
          S/
        </Text>

        <TextInput
          style={{
            fontSize: 14,
            fontFamily: "sans-semibold",
            color: colors.primary,
            paddingVertical: 12,
            minWidth: 20,
          }}
          value={displayValue}
          onChangeText={handleChangeText}
          onBlur={handleBlur}
          placeholder={placeholder}
          placeholderTextColor={colors.mutedForeground}
          keyboardType="decimal-pad"
          selectionColor={colors.accentPink}
          selectTextOnFocus
        />
      </View>

      {/* Botón + */}
      <Pressable
        onPress={handlePlus}
        className="px-3 py-3 items-center justify-center"
        hitSlop={8}
      >
        <Image
          source={icons.plus}
          className="size-4"
          tintColor={colors.primary}
          resizeMode="contain"
        />
      </Pressable>
    </View>
  );
}
