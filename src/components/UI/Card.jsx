import React from "react";

const Card = ({
  title,
  description,
  onClick,
  className = "",
  badge,
  icon,
  gradient = "from-blue-500 to-purple-600",
  variant = "default",
  children
}) => {
  const variants = {
    default: "bg-white border border-gray-100",
    glass: "bg-white/80 backdrop-blur-md border border-white/20",
    gradient: `bg-gradient-to-br ${gradient}`,
    outlined: "bg-white border-2 border-gray-200 hover:border-blue-300"
  };

  const isClickable = onClick ? "cursor-pointer" : "";

  return (
    <div
      onClick={onClick}
      className={`${variants[variant]} rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl group ${isClickable} ${className}`}
    >
      {/* Gradient overlay for hover effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      <div className="relative p-6">
        {/* Icon and Badge Row */}
        <div className="flex items-start justify-between mb-4">
          {icon && (
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 ${
              variant === 'gradient' ? 'bg-white/20' : 'bg-gradient-to-br from-blue-500 to-purple-600'
            }`}>
              <div className={variant === 'gradient' ? 'text-white' : 'text-white'}>
                {icon}
              </div>
            </div>
          )}
          {badge && (
            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md">
              {badge}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="space-y-3">
          <h3 className={`text-xl font-bold transition-colors duration-300 ${
            variant === 'gradient'
              ? 'text-white group-hover:text-blue-100'
              : 'text-gray-800 group-hover:text-blue-600'
          }`}>
            {title}
          </h3>

          {description && (
            <p className={`text-sm leading-relaxed ${
              variant === 'gradient'
                ? 'text-white/90'
                : 'text-gray-600'
            }`}>
              {description}
            </p>
          )}

          {children && (
            <div className="mt-4">
              {children}
            </div>
          )}
        </div>

        {/* Hover indicator */}
        {onClick && (
          <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              variant === 'gradient' ? 'bg-white/20' : 'bg-blue-50'
            }`}>
              <svg className={`w-4 h-4 ${variant === 'gradient' ? 'text-white' : 'text-blue-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;
