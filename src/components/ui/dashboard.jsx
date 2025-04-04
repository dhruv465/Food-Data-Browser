import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { useTheme } from '../../lib/theme-context';
import { applyGlass } from '../../lib/glassmorphism';

/**
 * Dashboard component - Main dashboard layout with stats and quick access cards
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Dashboard content
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} - Dashboard component
 */
const Dashboard = ({ 
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
 * DashboardHeader component - Header section with summary stats
 * 
 * @param {Object} props - Component props
 * @param {string} props.title - Dashboard title
 * @param {string} props.description - Dashboard description
 * @param {React.ReactNode} props.action - Optional action button/component
 * @param {Array} props.stats - Array of stat objects to display
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} - DashboardHeader component
 */
export const DashboardHeader = ({
  title,
  description,
  action,
  stats = [],
  className,
  ...props
}) => {
  const { theme } = useTheme();
  
  return (
    <div
      className={cn(
        "p-6 rounded-lg",
        applyGlass('card', theme, 'bg-opacity-80'),
        className
      )}
      {...props}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
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
      
      {stats.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <DashboardStat key={index} {...stat} />
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * DashboardStat component - Individual stat card
 * 
 * @param {Object} props - Component props
 * @param {string} props.label - Stat label
 * @param {string|number} props.value - Stat value
 * @param {React.ReactNode} props.icon - Optional icon
 * @param {string} props.description - Optional description
 * @param {string} props.trend - Optional trend direction ('up', 'down', or 'neutral')
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} - DashboardStat component
 */
export const DashboardStat = ({
  label,
  value,
  icon,
  description,
  trend,
  className,
  ...props
}) => {
  const { theme } = useTheme();
  
  return (
    <div
      className={cn(
        "p-4 rounded-lg",
        applyGlass('card', theme, 'bg-opacity-60'),
        className
      )}
      {...props}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">{label}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
          {trend && (
            <div className="flex items-center mt-2">
              {trend === 'up' ? (
                <span className="text-green-600 dark:text-green-400 flex items-center text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                  </svg>
                  Increasing
                </span>
              ) : trend === 'down' ? (
                <span className="text-red-600 dark:text-red-400 flex items-center text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1v-5a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586l-4.293-4.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clipRule="evenodd" />
                  </svg>
                  Decreasing
                </span>
              ) : (
                <span className="text-gray-600 dark:text-gray-400 flex items-center text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7 2a1 1 0 00-.707 1.707L7.586 5H7a3 3 0 00-3 3v6a3 3 0 003 3h6a3 3 0 003-3v-.586l1.293 1.293A1 1 0 0019 14a1 1 0 00-.293-.707l-11-11A1 1 0 007 2zm3 6a1 1 0 112 0v3.586l1.293 1.293A1 1 0 0115 13V8a1 1 0 00-1-1h-4z" clipRule="evenodd" />
                  </svg>
                  Stable
                </span>
              )}
            </div>
          )}
        </div>
        {icon && (
          <div className="p-2 rounded-full bg-primary/10 text-primary">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * DashboardGrid component - Grid layout for dashboard cards
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Grid items
 * @param {string} props.className - Additional CSS classes
 * @param {number} props.columns - Number of columns (default: 3)
 * @returns {JSX.Element} - DashboardGrid component
 */
export const DashboardGrid = ({
  children,
  className,
  columns = 3,
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

/**
 * DashboardCard component - Card for dashboard sections
 * 
 * @param {Object} props - Component props
 * @param {string} props.title - Card title
 * @param {string} props.description - Card description
 * @param {React.ReactNode} props.icon - Optional icon
 * @param {React.ReactNode} props.children - Card content
 * @param {React.ReactNode} props.action - Optional action button/component
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} - DashboardCard component
 */
export const DashboardCard = ({
  title,
  description,
  icon,
  children,
  action,
  className,
  ...props
}) => {
  const { theme } = useTheme();
  
  return (
    <div
      className={cn(
        "rounded-lg overflow-hidden",
        applyGlass('card', theme),
        className
      )}
      {...props}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            {icon && (
              <div className="p-2 rounded-full bg-primary/10 text-primary">
                {icon}
              </div>
            )}
            <div>
              <h3 className="text-lg font-semibold">{title}</h3>
              {description && (
                <p className="text-sm text-muted-foreground">{description}</p>
              )}
            </div>
          </div>
          {action && (
            <div>
              {action}
            </div>
          )}
        </div>
        <div>
          {children}
        </div>
      </div>
    </div>
  );
};

/**
 * QuickLink component - Card with link to another page
 * 
 * @param {Object} props - Component props
 * @param {string} props.title - Link title
 * @param {string} props.description - Link description
 * @param {string} props.to - Link destination
 * @param {React.ReactNode} props.icon - Optional icon
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} - QuickLink component
 */
export const QuickLink = ({
  title,
  description,
  to,
  icon,
  className,
  ...props
}) => {
  const { theme } = useTheme();
  
  return (
    <Link
      to={to}
      className={cn(
        "block rounded-lg p-6 transition-all duration-300",
        "hover:shadow-md hover:-translate-y-1",
        applyGlass('card', theme, 'bg-opacity-60'),
        className
      )}
      {...props}
    >
      <div className="flex items-start space-x-4">
        {icon && (
          <div className="p-2 rounded-full bg-primary/10 text-primary">
            {icon}
          </div>
        )}
        <div>
          <h3 className="text-lg font-semibold mb-1">{title}</h3>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default Dashboard;