import { create } from 'zustand';
import type { CheckResult, ErrorCategory } from '@/types';

interface CheckStore {
  isChecking: boolean;
  progress: number;
  currentDimension: ErrorCategory | '';
  results: CheckResult[];
  totalErrors: number;
  passRate: number;
  categories: Array<{ category: string; count: number; percentage: number }>;
  startCheck: () => void;
  updateProgress: (progress: number, dimension: ErrorCategory) => void;
  setResults: (results: CheckResult[], totalErrors: number, passRate: number, categories: Array<{ category: string; count: number; percentage: number }>) => void;
  resetCheck: () => void;
}

export const useCheckStore = create<CheckStore>((set) => ({
  isChecking: false,
  progress: 0,
  currentDimension: '',
  results: [],
  totalErrors: 0,
  passRate: 0,
  categories: [],
  startCheck: () => set({ isChecking: true, progress: 0, results: [], totalErrors: 0 }),
  updateProgress: (progress, dimension) =>
    set({ progress, currentDimension: dimension }),
  setResults: (results, totalErrors, passRate, categories) => 
    set({ results, totalErrors, passRate, categories, isChecking: false, progress: 100 }),
  resetCheck: () =>
    set({ isChecking: false, progress: 0, currentDimension: '', results: [], totalErrors: 0, passRate: 0, categories: [] }),
}));
