import { ApiClient } from "@/lib/api/client";
import { ImageSourcePropType } from "react-native";
import { create } from "zustand";

export interface UserProfile {
  name: string;
  username: string;
  bio: string;
  avatarUri: string | null;
  location: string;
  genres: string[];
  spotifyPlaylist: string;
  phone: string;
  visibleInRadar: boolean;
}

export interface ProfileEventItem {
  id: string;
  title: string;
  location: string;
  dateBadge: string;
  image: ImageSourcePropType | { uri: string };
  status: "approved" | "confirmed" | "favorited";
  statusLabel: string;
  contactPhone?: string;
  externalTicketUrl?: string;
  contactMethod?: "chat" | "external";
}

interface UserStore {
  profile: UserProfile;
  loading: boolean;
  fetchProfile: (api: ApiClient) => Promise<void>;
  saveProfile: (api: ApiClient, updates: Partial<UserProfile>) => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => void;
  setAvatarUri: (uri: string | null) => void;
}

const mapMongoUserToProfile = (
  data: any,
  current: UserProfile,
): UserProfile => {
  return {
    name: data.name ?? current.name,
    username: data.username ?? current.username,
    bio: data.bio ?? current.bio,
    avatarUri: data.avatarUrl ?? current.avatarUri,
    location: data.location ?? current.location,
    genres:
      Array.isArray(data.genres) && data.genres.length > 0
        ? data.genres
        : current.genres,
    spotifyPlaylist: data.spotifyPlaylist ?? current.spotifyPlaylist,
    phone: data.phone ?? current.phone,
    visibleInRadar: data.visibleInRadar ?? current.visibleInRadar,
  };
};

export const useUserStore = create<UserStore>((set) => ({
  profile: {
    name: "",
    username: "",
    bio: "",
    avatarUri: null,
    location: "",
    genres: [],
    spotifyPlaylist: "",
    phone: "",
    visibleInRadar: false,
  },
  loading: false,

  fetchProfile: async (api) => {
    try {
      set({ loading: true });
      const res = await api.get<{ success: boolean; data: any }>("/users/me");
      if (res?.success && res.data) {
        set((state) => ({
          profile: mapMongoUserToProfile(res.data, state.profile),
          loading: false,
        }));
      } else {
        set({ loading: false });
      }
    } catch (error) {
      console.warn("fetchProfile offline/error:", error);
      set({ loading: false });
    }
  },

  saveProfile: async (api, updates) => {
    // Optimistic update
    set((state) => ({
      profile: {
        ...state.profile,
        ...updates,
      },
    }));

    try {
      const currentProfile = useUserStore.getState().profile;
      const payload: Record<string, any> = {
        name: updates.name ?? currentProfile.name,
        username: updates.username ?? currentProfile.username,
        bio: updates.bio ?? currentProfile.bio,
        location: updates.location ?? currentProfile.location,
        genres: updates.genres ?? currentProfile.genres,
        spotifyPlaylist:
          updates.spotifyPlaylist ?? currentProfile.spotifyPlaylist,
        phone: updates.phone ?? currentProfile.phone,
        visibleInRadar:
          updates.visibleInRadar !== undefined
            ? updates.visibleInRadar
            : currentProfile.visibleInRadar,
      };

      if (updates.avatarUri !== undefined) {
        payload.avatarUrl = updates.avatarUri;
      }

      const res = await api.put<{ success: boolean; data: any }>(
        "/users/me",
        payload,
      );

      if (res?.success && res.data) {
        set((state) => ({
          profile: mapMongoUserToProfile(res.data, state.profile),
        }));
      }
    } catch (error) {
      console.error("saveProfile error in MongoDB:", error);
      throw error;
    }
  },

  updateProfile: (updates) =>
    set((state) => ({
      profile: {
        ...state.profile,
        ...updates,
      },
    })),

  setAvatarUri: (uri) =>
    set((state) => ({
      profile: {
        ...state.profile,
        avatarUri: uri,
      },
    })),
}));
