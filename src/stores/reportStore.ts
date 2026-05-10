import { create } from 'zustand';
import type { Report } from '@/types';

interface ReportStore {
  report: Report | null;
  isGenerating: boolean;
  generateReport: () => void;
  setReport: (report: Report) => void;
  clearReport: () => void;
}

export const useReportStore = create<ReportStore>((set) => ({
  report: null,
  isGenerating: false,
  generateReport: () => set({ isGenerating: true }),
  setReport: (report) => set({ report, isGenerating: false }),
  clearReport: () => set({ report: null }),
}));
