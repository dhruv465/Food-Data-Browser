import React from 'react';
import GlassCard from '../ui/glass-card';
import Skeleton from '../ui/skeleton';

/**
 * ProductSkeleton component for loading states
 * 
 * @returns {JSX.Element} - ProductSkeleton component
 */
const ProductSkeleton = () => {
  return (
    <GlassCard className="h-full flex flex-col p-4">
      <Skeleton className="mb-3 rounded-lg aspect-square" />
      
      <Skeleton className="h-4 w-16 mb-2" />
      <Skeleton className="h-6 w-full mb-2" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-full mt-2" />
      <Skeleton className="h-4 w-5/6 mt-1" />
    </GlassCard>
  );
};

export default ProductSkeleton;
