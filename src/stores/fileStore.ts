import { create } from 'zustand';
import type { UploadedFile } from '@/types';

interface FileStore {
  files: UploadedFile[];
  addFile: (file: UploadedFile) => void;
  updateFile: (id: string, updates: Partial<UploadedFile>) => void;
  removeFile: (id: string) => void;
  clearFiles: () => void;
  renameFile: (id: string, newName: string) => void;
}

export const useFileStore = create<FileStore>((set) => ({
  files: [],
  addFile: (file) => set((state) => ({ files: [...state.files, file] })),
  updateFile: (id, updates) =>
    set((state) => ({
      files: state.files.map((f) => (f.id === id ? { ...f, ...updates } : f)),
    })),
  removeFile: (id) =>
    set((state) => ({
      files: state.files.filter((f) => f.id !== id),
    })),
  clearFiles: () => set({ files: [] }),
  renameFile: (id, newName) =>
    set((state) => ({
      files: state.files.map((f) =>
        f.id === id ? { ...f, name: newName } : f
      ),
    })),
}));
