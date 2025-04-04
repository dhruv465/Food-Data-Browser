import React from 'react';
import { cn } from '../../lib/utils';

/**
 * GlassCard component with glassmorphism effect
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Card content
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.style - Additional inline styles
 * @returns {JSX.Element} - GlassCard component
 */
const GlassCard = ({ 
  children, 
  className, 
  style,
  ...props 
}) => {
  return (
    <div
      className={cn(
        "relative rounded-lg backdrop-blur-md bg-white/40 dark:bg-black/40",
        "border border-white/40 dark:border-white/10",
        "shadow-sm hover:shadow-md transition-all duration-300",
        "overflow-hidden",
        className
      )}
      style={{
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        ...style
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassCard;
