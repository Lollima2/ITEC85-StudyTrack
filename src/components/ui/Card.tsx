import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  animate?: boolean;
}

const Card: React.FC<CardProps> = ({ children, className = '', onClick, animate = true }) => {
  const baseClasses = 'w-full p-8 rounded-2xl backdrop-blur-lg bg-white/30 dark:bg-white/10 shadow-xl border border-white/20 ';

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