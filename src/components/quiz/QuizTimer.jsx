import React from 'react';

const QuizTimer = ({ timeLeft, status = 'normal', className = '' }) => {
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getStatusColor = () => {
    switch (status) {
      case 'expired':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'warning':
        return 'text-red-500 bg-red-50 border-red-200';
      case 'caution':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default:
        return 'text-slate-700 bg-white border-slate-200';
    }
  };

  const getIcon = () => {
    if (status === 'expired') {
      return (
        <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    }
    
    return (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
  };

  return (
    <div className={`bg-white/60 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg border ${getStatusColor()} ${className}`}>
      <div className="flex items-center space-x-2">
        {getIcon()}
        <span className={`font-mono font-bold ${status === 'expired' ? 'text-red-600' : status === 'warning' ? 'text-red-500' : status === 'caution' ? 'text-yellow-600' : 'text-slate-700'}`}>
          {formatTime(timeLeft)}
        </span>
        {status === 'expired' && (
          <span className="text-xs text-red-600 font-medium">Waktu Habis!</span>
        )}
      </div>
    </div>
  );
};

export default QuizTimer;
