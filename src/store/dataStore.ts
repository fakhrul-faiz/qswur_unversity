import { create } from 'zustand';
import { TOCFormData, FSRFormData, IFRFormData, ISRFormData, CalculationResult } from '../types';

interface DataState {
  tocData: Partial<TOCFormData>;
  fsrData: Partial<FSRFormData>;
  ifrData: Partial<IFRFormData>;
  isrData: Partial<ISRFormData>;
  
  fsrResult: CalculationResult | null;
  ifrResult: CalculationResult | null;
  isrResult: CalculationResult | null;
  
  activeTab: string;
  
  setTocData: (data: Partial<TOCFormData>) => void;
  setFsrData: (data: Partial<FSRFormData>) => void;
  setIfrData: (data: Partial<IFRFormData>) => void;
  setIsrData: (data: Partial<ISRFormData>) => void;
  
  setFsrResult: (result: CalculationResult | null) => void;
  setIfrResult: (result: CalculationResult | null) => void;
  setIsrResult: (result: CalculationResult | null) => void;
  
  setActiveTab: (tab: string) => void;
}

export const useDataStore = create<DataState>((set) => ({
  tocData: {},
  fsrData: {},
  ifrData: {},
  isrData: {},
  
  fsrResult: null,
  ifrResult: null,
  isrResult: null,
  
  activeTab: 'toc',
  
  setTocData: (data) => set((state) => ({ tocData: { ...state.tocData, ...data } })),
  setFsrData: (data) => set((state) => ({ fsrData: { ...state.fsrData, ...data } })),
  setIfrData: (data) => set((state) => ({ ifrData: { ...state.ifrData, ...data } })),
  setIsrData: (data) => set((state) => ({ isrData: { ...state.isrData, ...data } })),
  
  setFsrResult: (result) => set({ fsrResult: result }),
  setIfrResult: (result) => set({ ifrResult: result }),
  setIsrResult: (result) => set({ isrResult: result }),
  
  setActiveTab: (tab) => set({ activeTab: tab }),
}));