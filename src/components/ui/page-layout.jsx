import React from 'react';
import { cn } from '../../lib/utils';
import { useTheme } from '../../lib/theme-context';
import { applyGlass } from '../../lib/glassmorphism';

/**
 * PageLayout component - Container for page content within the app layout
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Page content
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} - PageLayout component
 */
const PageLayout = ({ 
  children, 
  className,
  ...props 
}) => {
  return (
    <div
      className={cn(
        "w-full space-y-6",
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
        "mb-8 p-6 rounded-lg",
        applyGlass('card', theme, 'bg-opacity-80'),
        className
      )}
      {...props}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
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
 * @param {string} props.description - Section description
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
      <div className="w-full">
        {children}
      </div>
    </section>
  );
};

/**
 * PageGrid component - Grid layout for page content
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Grid items
 * @param {string} props.className - Additional CSS classes
 * @param {number} props.columns - Number of columns (default: 1)
 * @returns {JSX.Element} - PageGrid component
 */
export const PageGrid = ({
  children,
  className,
  columns = 1,
  ...props
}) => {
  return (
    <div
      className={cn(
        "grid gap-6",
        columns === 1 ? "" : 
          columns === 2 ? "grid-cols-1 md:grid-cols-2" :
          columns === 3 ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" :
          columns === 4 ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" :
          "grid-cols-1",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default PageLayout;