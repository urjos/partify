import { supabase } from "@/lib/supabase";
import { decode } from "base64-arraybuffer";
import { File } from "expo-file-system";
import * as FileSystemLegacy from "expo-file-system/legacy";

export const USERS_MEDIA_BUCKET = "users-media";

export const isSupabaseStorageUrl = (
  url?: string | null,
  bucket: string = USERS_MEDIA_BUCKET,
): boolean => {
  if (!url || typeof url !== "string") return false;
  return (
    url.startsWith("http") &&
    (url.includes(`/${bucket}/`) ||
      url.includes(`/storage/v1/object/public/${bucket}/`))
  );
};

export const extractSupabasePath = (
  url: string,
  bucket: string = USERS_MEDIA_BUCKET,
): string | null => {
  if (!url || typeof url !== "string") return null;
  try {
    const marker = `/${bucket}/`;
    const index = url.indexOf(marker);
    if (index === -1) return null;
    const pathWithQuery = url.substring(index + marker.length);
    const cleanPath = pathWithQuery.split("?")[0];
    return decodeURIComponent(cleanPath);
  } catch {
    return null;
  }
};

export const deleteFromSupabase = async (
  bucket: string,
  fileUrlOrPath?: string | null,
): Promise<boolean> => {
  if (!fileUrlOrPath || typeof fileUrlOrPath !== "string") return false;
  try {
    // Si no es una URL de Supabase de este bucket, no hacemos nada (ej. Google, Clerk o file://)
    if (!isSupabaseStorageUrl(fileUrlOrPath, bucket)) {
      return false;
    }

    const relativePath = extractSupabasePath(fileUrlOrPath, bucket);
    if (!relativePath) return false;

    const { error } = await supabase.storage
      .from(bucket)
      .remove([relativePath]);

    if (error) {
      console.warn(
        `[Supabase Storage] No se pudo eliminar ${relativePath} de ${bucket}:`,
        error,
      );
      return false;
    }
    return true;
  } catch (err) {
    console.warn(`[Supabase Storage] Excepción al eliminar archivo:`, err);
    return false;
  }
};

export interface UploadAvatarOptions {
  base64?: string;
  previousUrl?: string | null;
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

  // 1. Eliminar la foto anterior SOLO si pertenecía a users-media (nunca Google o Clerk)
  if (options?.previousUrl) {
    await deleteFromSupabase(USERS_MEDIA_BUCKET, options.previousUrl);
  }

  // 2. Preparar el nombre del archivo y contentType
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

export const deleteUserAvatar = async (
  avatarUrl?: string | null,
): Promise<boolean> => {
  return deleteFromSupabase(USERS_MEDIA_BUCKET, avatarUrl);
};
