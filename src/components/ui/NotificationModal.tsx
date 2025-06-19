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
            return "bg-blue-100 border-blue-400 text-blue-900 dark:bg-blue-900 dark:border-blue-500 dark:text-blue-100";
        case "edit":
            return "bg-yellow-100 border-yellow-400 text-yellow-900 dark:bg-yellow-900 dark:border-yellow-500 dark:text-yellow-100";
        case "delete":
            return "bg-red-100 border-red-400 text-red-900 dark:bg-red-900 dark:border-red-500 dark:text-red-100";
        default:
            return "bg-gray-100 border-gray-300 text-gray-900 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100";
    }
};

const NotificationModal: React.FC<NotificationModalProps> = ({
    message,
    visible,
    type,
}) => {
    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none"
                    initial={{ opacity: 0, y: -40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -40 }}
                    transition={{ duration: 0.3 }}
                >
                    <div
                        className={`relative rounded-lg shadow-xl border px-3 py-2 flex items-center justify-center max-w-xs w-full mx-2 pointer-events-auto ${getModalStyles(
                            type
                        )}`}
                    >
                        <p className="text-sm font-semibold flex-1 text-center">{message}</p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default NotificationModal;
