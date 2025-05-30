import React from "react";

const Input = ({ label, id, type = "text", error, icon, ...props }) => {
  return (
    <div className="group">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-blue-600 transition-colors duration-200"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <div className="text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200">
              {icon}
            </div>
          </div>
        )}
        <input
          id={id}
          type={type}
          className={`appearance-none block w-full ${
            icon ? "pl-10" : "pl-4"
          } pr-4 py-3 bg-white border-2 ${
            error
              ? "border-red-300 focus:border-red-500 focus:ring-red-200"
              : "border-gray-200 focus:border-blue-500 focus:ring-blue-200"
          } rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 shadow-sm hover:shadow-md transition-all duration-200 transform focus:scale-[1.02]`}
          {...props}
        />
        <div className={`absolute inset-0 rounded-xl pointer-events-none transition-all duration-200 ${
          error ? "shadow-red-100" : "group-focus-within:shadow-blue-100"
        } group-focus-within:shadow-lg`}></div>
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600 flex items-center animate-fade-in">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
