import { create } from "zustand";

interface PickedLocation {
  address: string;
  latitude: number;
  longitude: number;
}

interface LocationPickerStore {
  pickedLocation: PickedLocation | null;
  setPickedLocation: (location: PickedLocation) => void;
  clearPickedLocation: () => void;
}

export const useLocationPickerStore = create<LocationPickerStore>((set) => ({
  pickedLocation: null,
  setPickedLocation: (location) => set({ pickedLocation: location }),
  clearPickedLocation: () => set({ pickedLocation: null }),
}));
