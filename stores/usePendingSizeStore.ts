import { create } from "zustand";

interface PendingSizeState {
  pendingSize: number;
  setPendingSize: (size: number) => void;
}

const usePendingSizeStore = create<PendingSizeState>((set) => ({
  pendingSize: 0,
  setPendingSize: (size) => set({ pendingSize: size }),
}));

export default usePendingSizeStore;
