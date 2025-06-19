// src/components/ui/AppToast.tsx
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useToast from '../../store/useToast';
import { CheckCircle, XCircle, Info } from 'lucide-react';

const toastTypeStyles = {
  success: { bg: 'bg-blue-500', Icon: CheckCircle },
  add: { bg: 'bg-green-500', Icon: CheckCircle },
  edit: { bg: 'bg-yellow-500', Icon: Info },
  delete: { bg: 'bg-red-500', Icon: XCircle },
  error: { bg: 'bg-red-500', Icon: XCircle },
  center: { bg: 'bg-blue-500', Icon: Info },
};

const AppToast: React.FC = () => {
  const { visible, message, type, hideToast } = useToast();
  const { bg, Icon } = toastTypeStyles[type] || toastTypeStyles.success;

  useEffect(() => {
    if (visible) {
      const timeout = setTimeout(() => hideToast(), 3000);
      return () => clearTimeout(timeout);
    }
  }, [visible, hideToast]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: type === 'center' ? '-50%' : -30 }}
          animate={{ opacity: 1, y: type === 'center' ? '-50%' : 0 }}
          exit={{ opacity: 0, y: type === 'center' ? '-50%' : -30 }}
          transition={{ duration: 0.3 }}
          className={`fixed z-50 px-6 py-3 text-white rounded-xl shadow-lg ${bg} 
            ${type === 'center' 
              ? 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2' 
              : 'top-6 left-1/2 transform -translate-x-1/2'}`}
        >
          <div className="flex items-center space-x-2">
            <Icon size={20} />
            <span>{message}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AppToast;
