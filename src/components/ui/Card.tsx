import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  animate?: boolean;
}

const Card: React.FC<CardProps> = ({ children, className = '', onClick, animate = true }) => {
  const baseClasses = 'max-w-lg bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-8 space-y-6 transition-all ml-0 mr-auto';


  const cardElement = (
    <div 
      className={`${baseClasses} ${className}`} 
      onClick={onClick}
    >
      {children}
    </div>
  );

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
      >
        {cardElement}
      </motion.div>
    );
  }

  return cardElement;
};

export default Card;