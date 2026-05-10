import { create } from 'zustand';
import type { CheckResult, ErrorCategory, UploadedFile } from '@/types';

interface FileStore {
  files: UploadedFile[];
  apiKey: string;
  documentText: string;
  addFile: (file: UploadedFile) => void;
  updateFile: (id: string, updates: Partial<UploadedFile>) => void;
  removeFile: (id: string) => void;
  clearFiles: () => void;
  renameFile: (id: string, newName: string) => void;
  setApiKey: (key: string) => void;
  setDocumentText: (text: string) => void;
}

export const useFileStore = create<FileStore>((set) => ({
  files: [],
  apiKey: '',
  documentText: '',
  addFile: (file) => set((state) => ({ files: [...state.files, file] })),
  updateFile: (id, updates) =>
    set((state) => ({
      files: state.files.map((f) => (f.id === id ? { ...f, ...updates } : f)),
    })),
  removeFile: (id) =>
    set((state) => ({
      files: state.files.filter((f) => f.id !== id),
    })),
  clearFiles: () => set({ files: [], documentText: '' }),
  renameFile: (id, newName) =>
    set((state) => ({
      files: state.files.map((f) =>
        f.id === id ? { ...f, name: newName } : f
      ),
    })),
  setApiKey: (key) => set({ apiKey: key }),
  setDocumentText: (text) => set({ documentText: text }),
}));
