import { create } from "zustand";

interface useIssueModalState {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

export const useIssueModal = create<useIssueModalState>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));
