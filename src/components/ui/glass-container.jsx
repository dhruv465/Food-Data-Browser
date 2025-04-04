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
        "relative rounded-2xl backdrop-blur-lg bg-white/10 dark:bg-black/10",
        "border border-white/20 dark:border-white/5",
        "shadow-xl p-6",
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
