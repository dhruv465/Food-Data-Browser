import React from 'react';
import { cn } from '../../lib/utils';

/**
 * GlassmorphicBackground component for creating a glassmorphism background effect
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Container content
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} - GlassmorphicBackground component
 */
const GlassmorphicBackground = ({ 
  children, 
  className,
  ...props 
}) => {
  return (
    <div 
      className={cn(
        "min-h-screen w-full bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-blue-950",
        "relative overflow-hidden",
        className
      )}
      {...props}
    >
      {/* Decorative circles for background effect */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-300/30 dark:bg-blue-500/10 blur-3xl" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-300/30 dark:bg-purple-500/10 blur-3xl" />
      <div className="absolute top-[30%] right-[20%] w-[30%] h-[30%] rounded-full bg-pink-300/20 dark:bg-pink-500/10 blur-3xl" />
      
      {/* Content container */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default GlassmorphicBackground;
