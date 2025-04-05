import React from 'react';
import { cn } from '../../lib/utils';

/**
 * Container component with modern flat design for page sections
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Container content
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.style - Additional inline styles
 * @returns {JSX.Element} - Container component
 */
const Container = ({ 
  children, 
  className, 
  style,
  ...props 
}) => {
  return (
    <div
      className={cn(
        "relative rounded-xl bg-white dark:bg-zinc-900",
        "border border-gray-100 dark:border-zinc-800",
        "shadow-md hover:shadow-lg transition-all duration-300 p-6",
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

// Export as both Container (new name) and GlassContainer (for backward compatibility)
export { Container };
export default Container;
