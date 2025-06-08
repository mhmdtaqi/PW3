import React from 'react';

const QuizProgress = ({ 
  currentQuestion, 
  totalQuestions, 
  answeredCount, 
  onQuestionSelect,
  answers = {},
  questions = [],
  className = '' 
}) => {
  const progressPercentage = ((currentQuestion + 1) / totalQuestions) * 100;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Progress Info */}
      <div className="flex items-center justify-between">
        <div className="bg-white/60 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg">
          <span className="text-sm font-semibold text-slate-700">
            {answeredCount} / {totalQuestions} dijawab
          </span>
        </div>
        
        <div className="bg-white/60 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg">
          <span className="text-sm font-semibold text-slate-700">
            Soal {currentQuestion + 1} dari {totalQuestions}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200 rounded-full h-2">
        <div 
          className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>

      {/* Question Navigation */}
      <div className="flex flex-wrap gap-2 justify-center">
        {questions.map((question, index) => {
          const isAnswered = answers[question.ID] !== undefined && answers[question.ID] !== '';
          const isCurrent = index === currentQuestion;
          
          return (
            <button
              key={index}
              onClick={() => onQuestionSelect && onQuestionSelect(index)}
              className={`w-10 h-10 rounded-lg font-semibold transition-all duration-200 ${
                isCurrent
                  ? 'bg-blue-500 text-white shadow-lg'
                  : isAnswered
                  ? 'bg-green-100 text-green-700 border border-green-300 hover:bg-green-200'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
              }`}
              title={`Soal ${index + 1}${isAnswered ? ' (Sudah dijawab)' : ' (Belum dijawab)'}`}
            >
              {index + 1}
            </button>
          );
        })}
      </div>

      {/* Progress Summary */}
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="bg-blue-50 rounded-lg p-3">
          <div className="text-2xl font-bold text-blue-600">{currentQuestion + 1}</div>
          <div className="text-xs text-blue-600 font-medium">Saat Ini</div>
        </div>
        <div className="bg-green-50 rounded-lg p-3">
          <div className="text-2xl font-bold text-green-600">{answeredCount}</div>
          <div className="text-xs text-green-600 font-medium">Dijawab</div>
        </div>
        <div className="bg-slate-50 rounded-lg p-3">
          <div className="text-2xl font-bold text-slate-600">{totalQuestions - answeredCount}</div>
          <div className="text-xs text-slate-600 font-medium">Tersisa</div>
        </div>
      </div>
    </div>
  );
};

export default QuizProgress;
