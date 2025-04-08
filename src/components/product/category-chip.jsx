import React from 'react';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

/**
 * CategoryChip component - Interactive category selection chip
 * 
 * @param {Object} props - Component props
 * @param {string} props.category - Category name
 * @param {boolean} props.selected - Whether the category is selected
 * @param {Function} props.onToggle - Toggle callback function
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} - CategoryChip component
 */
const CategoryChip = ({ category, selected, onToggle, className }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "inline-flex items-center gap-1 px-3 py-1 rounded-full cursor-pointer transition-colors",
        selected 
          ? "bg-primary text-primary-foreground" 
          : "bg-muted hover:bg-muted/80",
        className
      )}
      onClick={() => onToggle(category)}
    >
      <span className="text-sm font-medium">{category}</span>
      {selected && (
        <X className="h-3 w-3" />
      )}
    </motion.div>
  );
};

export default CategoryChip;