import React from 'react';

const Loading = ({ 
  size = 'medium', 
  message = 'Memuat...', 
  fullScreen = false,
  className = '' 
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'w-8 h-8 border-2';
      case 'large':
        return 'w-20 h-20 border-4';
      case 'medium':
      default:
        return 'w-16 h-16 border-4';
    }
  };

  const LoadingSpinner = () => (
    <div className="text-center">
      <div className={`${getSizeClasses()} border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4`}></div>
      {message && <p className="text-slate-600 font-medium">{message}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-8 flex items-center justify-center ${className}`}>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center p-8 ${className}`}>
      <LoadingSpinner />
    </div>
  );
};

// Skeleton loading component
export const SkeletonLoader = ({ 
  lines = 3, 
  className = '',
  height = 'h-4'
}) => {
  return (
    <div className={`animate-pulse ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div 
          key={index}
          className={`bg-slate-200 rounded ${height} mb-3 ${
            index === lines - 1 ? 'w-3/4' : 'w-full'
          }`}
        ></div>
      ))}
    </div>
  );
};

// Card skeleton loader
export const CardSkeleton = ({ className = '' }) => {
  return (
    <div className={`bg-white rounded-2xl p-6 shadow-lg animate-pulse ${className}`}>
      <div className="h-6 bg-slate-200 rounded mb-4 w-3/4"></div>
      <div className="space-y-3">
        <div className="h-4 bg-slate-200 rounded"></div>
        <div className="h-4 bg-slate-200 rounded w-5/6"></div>
        <div className="h-4 bg-slate-200 rounded w-4/6"></div>
      </div>
      <div className="mt-6 h-10 bg-slate-200 rounded"></div>
    </div>
  );
};

// Button loading state
export const ButtonLoading = ({ 
  loading = false, 
  children, 
  className = '',
  ...props 
}) => {
  return (
    <button 
      disabled={loading}
      className={`disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      {...props}
    >
      <div className="flex items-center justify-center space-x-2">
        {loading && (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
        )}
        <span>{children}</span>
      </div>
    </button>
  );
};

export default Loading;
