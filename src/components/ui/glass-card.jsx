import React from 'react';
import { cn } from '../../lib/utils';

/**
 * Card component with modern flat design
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Card content
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.style - Additional inline styles
 * @returns {JSX.Element} - Card component
 */
const Card = ({ 
  children, 
  className, 
  style,
  ...props 
}) => {
  return (
    <div
      className={cn(
        "relative rounded-lg bg-white dark:bg-zinc-900",
        "border border-gray-100 dark:border-zinc-800",
        "shadow-sm hover:shadow-md dark:shadow-md dark:hover:shadow-lg transition-all duration-300",
        "overflow-hidden",
        className
      )}
      style={style}
      {...props}
    >
      {children}
    </div>
  );
};

// Export as both Card (new name) and GlassCard (for backward compatibility)
export { Card };
export default Card;
