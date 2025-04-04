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
        "min-h-screen w-full bg-gradient-to-br from-green-50 to-teal-50 dark:from-gray-900 dark:to-gray-800",
        "relative overflow-hidden",
        className
      )}
      {...props}
    >
      {/* Decorative circles for background effect */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-green-300/20 dark:bg-green-500/10 blur-3xl" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[50%] h-[50%] rounded-full bg-teal-300/20 dark:bg-teal-500/10 blur-3xl" />
      <div className="absolute top-[30%] right-[20%] w-[30%] h-[30%] rounded-full bg-emerald-300/20 dark:bg-emerald-500/10 blur-3xl" />
      
      {/* Content container */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default GlassmorphicBackground;
