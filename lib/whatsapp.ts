import { Alert, Linking } from "react-native";

/**
 * Abre WhatsApp con el número especificado y un mensaje inicial contextualizado.
 * Si el número no tiene prefijo internacional y tiene 9 dígitos (estándar Perú),
 * se le añade automáticamente el código '51'.
 */
export const openWhatsApp = (phone?: string, eventTitle?: string) => {
  if (!phone || !phone.trim()) {
    Alert.alert(
      "Contacto no configurado",
      "El anfitrión de este evento no ha proporcionado un número de WhatsApp para contacto directo.",
    );
    return;
  }

  // Eliminar espacios, guiones y paréntesis
  let cleaned = phone.trim().replace(/[^0-9+]/g, "");

  if (cleaned.startsWith("+")) {
    cleaned = cleaned.substring(1);
  } else if (cleaned.length === 9) {
    cleaned = `51${cleaned}`;
  }

  const message = eventTitle
    ? `¡Hola! Te escribo desde Partify por tu evento "${eventTitle}". ¿Sigue disponible?`
    : "¡Hola! Te escribo desde Partify por tu evento. ¿Sigue disponible?";

  const url = `https://wa.me/${cleaned}?text=${encodeURIComponent(message)}`;

  Linking.openURL(url).catch(() => {
    Alert.alert(
      "No se pudo abrir WhatsApp",
      "Verifica que tengas la aplicación de WhatsApp instalada en tu dispositivo.",
    );
  });
};
