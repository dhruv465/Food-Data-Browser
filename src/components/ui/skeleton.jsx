import React from 'react';
import { cn } from '../../lib/utils';

/**
 * Skeleton component for loading states
 * 
 * @param {Object} props - Component props
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.style - Additional inline styles
 * @returns {JSX.Element} - Skeleton component
 */
const Skeleton = ({ 
  className, 
  style,
  ...props 
}) => {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-gray-200 dark:bg-gray-700",
        className
      )}
      style={style}
      {...props}
    />
  );
};

export default Skeleton;
