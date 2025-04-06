import React from 'react';
import { cn } from '../../lib/utils';
import { useTheme } from '../../lib/theme-context';
import { applyGlass } from '../../lib/glassmorphism';

/**
 * Card component with glassmorphism design
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Card content
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.style - Additional inline styles
 * @returns {JSX.Element} - Card component
 */
const GlassCard = ({ 
  children, 
  className, 
  style,
  ...props 
}) => {
  const { theme } = useTheme();
  
  return (
    <div
      className={cn(
        "relative rounded-lg overflow-hidden",
        applyGlass('card', theme),
        className
      )}
      style={style}
      {...props}
    >
      {children}
    </div>
  );
};

// Export as both GlassCard (new name) and Card (for backward compatibility)
export { GlassCard as Card };
export default GlassCard;
