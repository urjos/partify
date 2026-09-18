import { Alert, Linking } from "react-native";

/**
 * Abre WhatsApp con el número especificado y un mensaje inicial contextualizado.
 * Si el número no tiene prefijo internacional y tiene 9 dígitos (estándar Perú),
 * se le añade automáticamente el código '51'.
 */
export interface WhatsAppContactOptions {
  eventTitle?: string;
  userName?: string;
  customMessage?: string;
}

/**
 * Abre WhatsApp con el número especificado y un mensaje contextualizado:
 * - Si es para un evento (eventTitle): solicita más información sobre ese evento con su nombre.
 * - Si es desde el perfil del usuario (sin evento o con userName): solicita información sobre las fiestas que organiza.
 * - Si se especifica un customMessage, se envía directamente.
 */
export const openWhatsApp = (
  phone?: string,
  optionsOrTitle?: string | WhatsAppContactOptions,
) => {
  const options: WhatsAppContactOptions =
    typeof optionsOrTitle === "string"
      ? { eventTitle: optionsOrTitle }
      : optionsOrTitle || {};

  if (!phone || !phone.trim()) {
    Alert.alert(
      "Contacto no configurado",
      options.eventTitle
        ? "El anfitrión de este evento no ha proporcionado un número de WhatsApp para contacto directo."
        : "Este anfitrión no ha proporcionado un número de WhatsApp para contacto directo.",
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

  let message = "";
  if (options.customMessage) {
    message = options.customMessage;
  } else if (options.eventTitle && options.eventTitle.trim()) {
    message = `¡Hola! Te escribo desde Partify. Quisiera más información sobre el evento "${options.eventTitle.trim()}". ¿Sigue disponible?`;
  } else if (options.userName && options.userName.trim()) {
    message = `¡Hola ${options.userName.trim()}! Vi tu perfil en Partify y quisiera más información sobre las próximas fiestas y eventos que organizas.`;
  } else {
    message =
      "¡Hola! Vi tu perfil en Partify y quisiera más información sobre las próximas fiestas y eventos que organizas.";
  }

  const url = `https://wa.me/${cleaned}?text=${encodeURIComponent(message)}`;

  Linking.openURL(url).catch(() => {
    Alert.alert(
      "No se pudo abrir WhatsApp",
      "Verifica que tengas la aplicación de WhatsApp instalada en tu dispositivo.",
    );
  });
};
