import React from 'react';

const QuizNavigation = ({ 
  currentQuestion, 
  totalQuestions, 
  onPrevious, 
  onNext, 
  onSubmit,
  submitting = false,
  canGoNext = true,
  canGoPrevious = true,
  className = '' 
}) => {
  const isLastQuestion = currentQuestion === totalQuestions - 1;
  const isFirstQuestion = currentQuestion === 0;

  return (
    <div className={`flex justify-between items-center animate-scale-in ${className}`}>
      {/* Previous Button */}
      <button
        onClick={onPrevious}
        disabled={isFirstQuestion || !canGoPrevious}
        className="btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <div className="flex items-center space-x-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>Sebelumnya</span>
        </div>
      </button>

      {/* Question Indicator */}
      <div className="flex items-center space-x-2">
        <span className="text-sm text-slate-600">
          Soal {currentQuestion + 1} dari {totalQuestions}
        </span>
      </div>

      {/* Next/Submit Button */}
      {isLastQuestion ? (
        <button
          onClick={onSubmit}
          disabled={submitting}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Mengirim...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <span>Selesai</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
        </button>
      ) : (
        <button
          onClick={onNext}
          disabled={!canGoNext}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="flex items-center space-x-2">
            <span>Selanjutnya</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </button>
      )}
    </div>
  );
};

export default QuizNavigation;
