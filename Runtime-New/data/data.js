import { create } from "zustand";

export const useFileContentStore = create((set) => ({
  fileContent: "",
  setFileContent: (content) => set({ fileContent: content }),
  getFileContent: () => set({ fileContent: content }),
}));

export const useSelectedVArrayStore = create((set, get) => ({
  selectedVArray: [],
  setSelectedVArray: (array) => set({ selectedVArray: array }),
  getSelectedVArray: () => get().selectedVArray, // Use get() instead of set()
}));
