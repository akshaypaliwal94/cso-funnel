// components/common/Loading.tsx (or wherever you place shared components)

'use client';

import React from 'react';

interface LoadingProps {
  message?: string; // Optional custom message
  fullScreen?: boolean; // Default true for page-level loading
}

const Loading: React.FC<LoadingProps> = ({
  message = 'Loading...',
  fullScreen = true,
}) => {
  return (
    <div
      className={`flex min-h-screen items-center justify-center ${
        fullScreen ? 'bg-white' : 'bg-transparent'
      }`}
    >
      <div className="text-center">
        {/* Simple spinner - using Tailwind CSS classes (adjust if not using Tailwind) */}
        <div className="mx-auto mb-4 size-12 animate-spin rounded-full border-4 border-[#1A9BA3] border-t-transparent" />
        {/* Or use an SVG spinner if preferred */}
        {/* <svg className="mx-auto mb-4 h-12 w-12 animate-spin text-[#1A9BA3]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg> */}

        <p className="text-lg font-medium text-[#212121]">{message}</p>
      </div>
    </div>
  );
};

export default Loading;
