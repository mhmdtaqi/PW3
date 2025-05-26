import React from "react";

const Card = ({ title, description, onClick, className = "", badge }) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl group ${className}`}
    >
      <div className="p-6">
        {badge && (
          <div className="inline-block bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium mb-3">
            {badge}
          </div>
        )}
        <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors duration-300">
          {title}
        </h3>
        {description && (
          <p className="text-gray-600 text-sm line-clamp-2">{description}</p>
        )}
      </div>
    </div>
  );
};

export default Card;
