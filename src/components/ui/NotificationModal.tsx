import React from "react";
import { AnimatePresence, motion } from "framer-motion";

interface NotificationModalProps {
  message: string;
  visible: boolean;
  onClose: () => void;
  type: "add" | "edit" | "delete";
}

const getModalStyles = (type: string) => {
  switch (type) {
    case "add":
      return "bg-blue-100 border-blue-500 text-blue-800";
    case "edit":
      return "bg-yellow-100 border-yellow-500 text-yellow-800";
    case "delete":
      return "bg-red-100 border-red-500 text-red-800";
    default:
      return "bg-gray-100 border-gray-300 text-gray-800";
  }
};

const NotificationModal: React.FC<NotificationModalProps> = ({
  message,
  visible,
  onClose,
  type,
}) => {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 flex justify-center items-center z-50"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
        >
          <div
            className={`rounded-lg shadow-lg border px-6 py-4 ${getModalStyles(
              type
            )}`}
          >
            <p className="text-sm font-medium">{message}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationModal;
