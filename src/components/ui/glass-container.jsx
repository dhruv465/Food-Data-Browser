import React from 'react';
import { cn } from '../../lib/utils';

/**
 * GlassContainer component with glassmorphism effect for page sections
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Container content
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.style - Additional inline styles
 * @returns {JSX.Element} - GlassContainer component
 */
const GlassContainer = ({ 
  children, 
  className, 
  style,
  ...props 
}) => {
  return (
    <div
      className={cn(
        "relative rounded-xl backdrop-blur-md bg-white/30 dark:bg-black/30",
        "border border-white/30 dark:border-white/10",
        "shadow-md hover:shadow-lg transition-all duration-300 p-6",
        "overflow-hidden",
        className
      )}
      style={{
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        ...style
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassContainer;
