import React, { useState } from 'react';

const JoinCodeDisplay = ({ 
  joinCode, 
  className = "", 
  size = "normal", 
  variant = "green",
  showLabel = true,
  showCopyButton = true,
  showDescription = true 
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(joinCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = joinCode;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const variants = {
    green: {
      container: "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200",
      text: "text-green-700",
      code: "text-green-800 bg-green-100",
      icon: "text-green-600",
      button: "hover:bg-green-100"
    },
    orange: {
      container: "bg-orange-50 border-orange-200",
      text: "text-orange-700",
      code: "text-orange-700 bg-orange-100",
      icon: "text-orange-600",
      button: "hover:bg-orange-100"
    },
    blue: {
      container: "bg-blue-50 border-blue-200",
      text: "text-blue-700",
      code: "text-blue-800 bg-blue-100",
      icon: "text-blue-600",
      button: "hover:bg-blue-100"
    }
  };

  const sizes = {
    small: {
      container: "p-2",
      text: "text-xs",
      code: "text-sm px-2 py-1",
      icon: "w-3 h-3",
      button: "p-1"
    },
    normal: {
      container: "p-3",
      text: "text-sm",
      code: "text-lg px-2 py-1",
      icon: "w-4 h-4",
      button: "p-1"
    },
    large: {
      container: "p-4",
      text: "text-base",
      code: "text-xl px-3 py-2",
      icon: "w-5 h-5",
      button: "p-2"
    }
  };

  const currentVariant = variants[variant] || variants.green;
  const currentSize = sizes[size] || sizes.normal;

  if (!joinCode) return null;

  return (
    <div className={`${currentVariant.container} ${currentSize.container} border rounded-xl ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          {showLabel && (
            <div className={`${currentVariant.text} ${currentSize.text} font-medium mb-1 flex items-center space-x-1`}>
              <svg className={`${currentVariant.icon} ${currentSize.icon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-3a1 1 0 011-1h2.586l6.243-6.243A6 6 0 0121 9z" />
              </svg>
              <span>Kode Join:</span>
            </div>
          )}
          
          <div className="flex items-center space-x-2">
            <span className={`${currentVariant.code} ${currentSize.code} font-mono font-bold rounded`}>
              {joinCode}
            </span>
            
            {showCopyButton && (
              <button
                onClick={handleCopy}
                className={`${currentVariant.button} ${currentSize.button} rounded transition-colors duration-200 relative`}
                title={copied ? "Tersalin!" : "Salin kode join"}
              >
                {copied ? (
                  <svg className={`${currentVariant.icon} ${currentSize.icon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className={`${currentVariant.icon} ${currentSize.icon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
      
      {showDescription && (
        <div className={`mt-2 ${currentSize.text} ${currentVariant.text} opacity-75`}>
          Bagikan kode ini kepada siswa untuk bergabung dengan kelas
        </div>
      )}
      
      {copied && (
        <div className="mt-2 text-xs text-green-600 font-medium animate-pulse">
          ✓ Kode berhasil disalin ke clipboard!
        </div>
      )}
    </div>
  );
};

export default JoinCodeDisplay;
