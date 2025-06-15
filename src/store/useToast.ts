// src/store/useToast.ts
import { create } from 'zustand';

type ToastType = 'add' | 'edit' | 'delete' | 'success' | 'error';

interface ToastState {
  message: string;
  type: ToastType;
  visible: boolean;
  showToast: (message: string, type: ToastType) => void;
  hideToast: () => void;
}

const useToast = create<ToastState>((set) => ({
  message: '',
  type: 'success',
  visible: false,
  showToast: (message, type) => set({ message, type, visible: true }),
  hideToast: () => set({ visible: false }),
}));

export default useToast;
