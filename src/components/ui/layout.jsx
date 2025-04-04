import React from 'react';
import { cn } from '../../lib/utils';
import { useTheme } from '../../lib/theme-context';
import { applyGlass } from '../../lib/glassmorphism';

/**
 * Layout component - Main layout wrapper for the application
 * Provides consistent spacing and structure for all pages
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Layout content
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} - Layout component
 */
const Layout = ({ 
  children, 
  className,
  ...props 
}) => {
  return (
    <div
      className={cn(
        "w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * PageHeader component - Consistent header for all pages
 * 
 * @param {Object} props - Component props
 * @param {string} props.title - Page title
 * @param {string} props.description - Page description
 * @param {React.ReactNode} props.action - Optional action button/component
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} - PageHeader component
 */
export const PageHeader = ({
  title,
  description,
  action,
  className,
  ...props
}) => {
  const { theme } = useTheme();
  
  return (
    <div
      className={cn(
        "flex flex-col md:flex-row md:items-center justify-between gap-4",
        className
      )}
      {...props}
    >
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          {title}
        </h1>
        {description && (
          <p className="text-muted-foreground max-w-2xl">
            {description}
          </p>
        )}
      </div>
      {action && (
        <div className="flex-shrink-0">
          {action}
        </div>
      )}
    </div>
  );
};

/**
 * PageContent component - Container for main page content
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Content
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} - PageContent component
 */
export const PageContent = ({
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        "w-full",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * PageSection component - Section within a page
 * 
 * @param {Object} props - Component props
 * @param {string} props.title - Section title
 * @param {React.ReactNode} props.children - Section content
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} - PageSection component
 */
export const PageSection = ({
  title,
  description,
  children,
  className,
  ...props
}) => {
  const { theme } = useTheme();
  
  return (
    <section
      className={cn(
        "space-y-4 p-6 rounded-lg",
        applyGlass('card', theme),
        className
      )}
      {...props}
    >
      {(title || description) && (
        <div className="space-y-1">
          {title && (
            <h2 className="text-2xl font-semibold tracking-tight">
              {title}
            </h2>
          )}
          {description && (
            <p className="text-muted-foreground">
              {description}
            </p>
          )}
        </div>
      )}
      <div>
        {children}
      </div>
    </section>
  );
};

export default Layout;