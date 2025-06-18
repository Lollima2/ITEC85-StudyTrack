// src/store/useToast.ts
import { create } from 'zustand';

type ToastType = 'add' | 'edit' | 'delete' | 'success' | 'error' | 'center';
type ToastPosition = 'top' | 'center';

interface ToastState {
  message: string;
  type: ToastType;
  position: ToastPosition;
  visible: boolean;
  showToast: (message: string, type: ToastType, position?: ToastPosition) => void;
  hideToast: () => void;
}

const useToast = create<ToastState>((set) => ({
  message: '',
  type: 'success',
  position: 'top',
  visible: false,
  showToast: (message, type, position = 'top') =>
    set({ message, type, position, visible: true }),
  hideToast: () => set({ visible: false }),
}));

export default useToast;