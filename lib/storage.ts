import { supabase } from "@/lib/supabase";
import { decode } from "base64-arraybuffer";
import { File } from "expo-file-system";
import * as FileSystemLegacy from "expo-file-system/legacy";

export const USERS_MEDIA_BUCKET = "users-media";

export interface UploadAvatarOptions {
  base64?: string;
  userId?: string;
}

export const uploadUserAvatar = async (
  uri: string,
  options?: UploadAvatarOptions,
): Promise<string> => {
  if (!uri) throw new Error("La URI de la imagen es requerida");

  // Si ya es una URL remota no modificada, no es necesario volver a subirla
  if (uri.startsWith("http://") || uri.startsWith("https://")) {
    return uri;
  }

  // Deletion is intentionally server-side: only the API has enough context to
  // verify avatar ownership before using its service-role client.
  // 1. Prepare the file name and content type.
  const cleanUri = uri.split("?")[0];
  const ext = cleanUri.split(".").pop()?.toLowerCase() || "jpg";
  const validExt = ["jpg", "jpeg", "png", "webp"].includes(ext) ? ext : "jpg";
  const contentType =
    validExt === "png"
      ? "image/png"
      : validExt === "webp"
        ? "image/webp"
        : "image/jpeg";

  const safeUserId = options?.userId
    ? options.userId.replace(/[^a-zA-Z0-9_-]/g, "_")
    : "user";
  const filename = `avatars/${safeUserId}_${Date.now()}.${validExt}`;

  // 3. Preparar el buffer de datos con fallback dual
  let arrayBuffer: ArrayBuffer;
  if (options?.base64) {
    arrayBuffer = decode(options.base64);
  } else {
    try {
      const file = new File(uri);
      arrayBuffer = await file.arrayBuffer();
    } catch {
      const base64Str = await FileSystemLegacy.readAsStringAsync(uri, {
        encoding: FileSystemLegacy.EncodingType.Base64,
      });
      arrayBuffer = decode(base64Str);
    }
  }

  // 4. Subir al bucket "users-media"
  const { error: uploadError } = await supabase.storage
    .from(USERS_MEDIA_BUCKET)
    .upload(filename, arrayBuffer, {
      contentType,
      upsert: true,
    });

  if (uploadError) {
    console.error(
      "Error al subir foto de perfil a Supabase users-media:",
      uploadError,
    );
    throw new Error(
      `No se pudo subir la foto de perfil: ${uploadError.message}`,
    );
  }

  // 5. Obtener y retornar la URL pública
  const { data } = supabase.storage
    .from(USERS_MEDIA_BUCKET)
    .getPublicUrl(filename);

  return data.publicUrl;
};

export const uploadMediaToSupabase = async (
  uri: string,
  isVideo: boolean,
  base64?: string,
) => {
  if (uri.startsWith("http://") || uri.startsWith("https://")) return uri;

  const ext = uri.split(".").pop()?.split("?")[0] || (isVideo ? "mp4" : "jpg");
  const filename = `${Date.now()}_${Math.random().toString(36).substring(7)}.${ext}`;
  const contentType = isVideo ? "video/mp4" : "image/jpeg";

  let arrayBuffer: ArrayBuffer;

  if (base64) {
    arrayBuffer = decode(base64);
  } else {
    try {
      const file = new File(uri);
      arrayBuffer = await file.arrayBuffer();
    } catch {
      const base64Str = await FileSystemLegacy.readAsStringAsync(uri, {
        encoding: FileSystemLegacy.EncodingType.Base64,
      });
      arrayBuffer = decode(base64Str);
    }
  }

  const { error } = await supabase.storage
    .from("events-media")
    .upload(filename, arrayBuffer, {
      contentType,
      upsert: true,
    });

  if (error) {
    console.error("Error al subir multimedia a Supabase:", error);
    throw error;
  }

  const { data } = supabase.storage.from("events-media").getPublicUrl(filename);

  return data.publicUrl;
};
