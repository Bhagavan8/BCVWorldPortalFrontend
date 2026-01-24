import React from 'react';
import { BiChevronLeft } from 'react-icons/bi';

const JobDetailsSkeleton = () => {
  return (
    <div className="job-details-page page-wrapper font-sans pt-[104px]">
      <div className="main-content-area max-w-[1200px] mx-auto p-4">
        {/* Back Navigation Skeleton */}
        <div className="back-navigation-bar flex justify-between items-center py-5 border-b border-gray-100 mb-8 animate-pulse">
          <div className="flex items-center gap-2">
            <BiChevronLeft className="text-gray-300 text-xl" />
            <div className="h-4 bg-gray-200 rounded w-24"></div>
          </div>
          <div className="h-4 bg-gray-200 rounded w-48 hidden md:block"></div>
        </div>

        {/* Job Header Skeleton */}
        <div className="job-header-section pb-4 border-b border-gray-100 mb-4 animate-pulse">
          <div className="job-header-inner flex flex-col gap-6">
            <div className="company-brand flex items-start gap-5">
              <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0"></div>
              <div className="flex-1 space-y-3">
                <div className="h-8 bg-gray-200 rounded w-3/4 md:w-1/2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                <div className="flex items-center gap-2 mt-4">
                   <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                   <div className="h-3 bg-gray-200 rounded w-32"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Meta Grid Skeleton */}
          <div className="job-meta-section mt-6">
            <div className="meta-grid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="meta-item flex items-start gap-2">
                  <div className="w-6 h-6 bg-gray-200 rounded flex-shrink-0"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                    <div className="h-10 bg-gray-200 rounded w-full max-w-[120px]"></div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex gap-4 mt-4">
               <div className="h-10 bg-gray-200 rounded w-32"></div>
               <div className="h-10 bg-gray-200 rounded w-32"></div>
            </div>
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="space-y-8 mt-8 animate-pulse">
          {/* Description Block */}
          <div className="content-section">
             <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-gray-200 rounded"></div>
                <div className="h-6 bg-gray-200 rounded w-40"></div>
             </div>
             <div className="space-y-3">
               <div className="h-4 bg-gray-200 rounded w-full"></div>
               <div className="h-4 bg-gray-200 rounded w-full"></div>
               <div className="h-4 bg-gray-200 rounded w-5/6"></div>
               <div className="h-4 bg-gray-200 rounded w-full"></div>
               <div className="h-4 bg-gray-200 rounded w-4/5"></div>
             </div>
          </div>
          
          {/* Skills Block */}
          <div className="content-section">
             <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-gray-200 rounded"></div>
                <div className="h-6 bg-gray-200 rounded w-32"></div>
             </div>
             <div className="flex flex-wrap gap-2">
                {[1,2,3,4,5].map(i => (
                    <div key={i} className="h-8 bg-gray-200 rounded w-24"></div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsSkeleton;
