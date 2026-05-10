import { create } from 'zustand';
import type { CheckResult, ErrorCategory } from '@/types';

interface CheckStore {
  isChecking: boolean;
  progress: number;
  currentDimension: ErrorCategory | '';
  results: CheckResult[];
  startCheck: () => void;
  updateProgress: (progress: number, dimension: ErrorCategory) => void;
  setResults: (results: CheckResult[]) => void;
  resetCheck: () => void;
}

export const useCheckStore = create<CheckStore>((set) => ({
  isChecking: false,
  progress: 0,
  currentDimension: '',
  results: [],
  startCheck: () => set({ isChecking: true, progress: 0, results: [] }),
  updateProgress: (progress, dimension) =>
    set({ progress, currentDimension: dimension }),
  setResults: (results) => set({ results, isChecking: false, progress: 100 }),
  resetCheck: () =>
    set({ isChecking: false, progress: 0, currentDimension: '', results: [] }),
}));
