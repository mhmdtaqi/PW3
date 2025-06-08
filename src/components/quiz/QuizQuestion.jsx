import React from 'react';

const QuizQuestion = ({ 
  question, 
  questionNumber, 
  selectedAnswer, 
  onAnswerChange,
  className = '' 
}) => {
  // Parse options from various possible formats
  const parseOptions = (optionsData) => {
    try {
      // If it's already an array, return it
      if (Array.isArray(optionsData)) {
        return optionsData;
      }

      // If it's a string, try to parse it
      if (typeof optionsData === 'string') {
        const parsed = JSON.parse(optionsData);
        if (Array.isArray(parsed)) {
          return parsed;
        }
        // If parsed string is an object, continue processing
        optionsData = parsed;
      }

      // If it's an object, handle different formats
      if (optionsData && typeof optionsData === 'object') {
        // Check common property names
        if (optionsData.options && Array.isArray(optionsData.options)) {
          return optionsData.options;
        }

        const keys = Object.keys(optionsData);

        // Handle alphabetic keys (A, B, C, D) - COMMON FORMAT
        if (keys.length > 0 && keys.some(key => /^[A-Z]$/.test(key))) {
          const sortedKeys = keys.filter(key => /^[A-Z]$/.test(key)).sort();
          const options = sortedKeys.map(key => ({
            key: key,
            value: optionsData[key],
            label: `${key}. ${optionsData[key]}`
          }));
          return options;
        }

        // Handle numeric keys (0, 1, 2, 3)
        if (keys.length > 0 && keys.every(key => !isNaN(key))) {
          const options = keys.sort((a, b) => parseInt(a) - parseInt(b)).map(key => optionsData[key]);
          return options;
        }

        // Handle object with values directly
        if (keys.length > 0) {
          const options = keys.map(key => optionsData[key]);
          return options;
        }
      }

      return [];
    } catch (error) {
      console.error('Error parsing options:', error, 'Raw data:', optionsData);
      return [];
    }
  };

  // Try multiple possible option field names based on backend model
  const optionsData = question?.options_json ||  // JSON field from database
                     question?.Options ||        // Go struct field name
                     question?.options ||        // Alternative naming
                     question?.option_a && [     // Fallback to individual options
                       question.option_a,
                       question.option_b,
                       question.option_c,
                       question.option_d
                     ].filter(Boolean);

  const options = parseOptions(optionsData);

  return (
    <div className={`bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg animate-slide-up ${className}`}>
      <div className="flex items-start space-x-4 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold">
          {questionNumber}
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-slate-800 mb-4">{question.question}</h2>
          
          {/* Options */}
          <div className="space-y-3">
            {options && options.length > 0 ? (
              options.map((option, index) => {
                // Handle both string options and object options
                const optionKey = option.key || String.fromCharCode(65 + index); // A, B, C, D
                const optionValue = option.value || option;
                const optionLabel = option.label || `${optionKey}. ${optionValue}`;
                const optionForAnswer = option.key || optionValue; // Use key for answer if available

                return (
                  <label
                    key={index}
                    className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                      selectedAnswer === optionForAnswer
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question-${question.ID}`}
                      value={optionForAnswer}
                      checked={selectedAnswer === optionForAnswer}
                      onChange={(e) => onAnswerChange && onAnswerChange(question.ID, e.target.value)}
                      className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                    />
                    <span className="ml-3 text-slate-700 font-medium">{optionLabel}</span>
                  </label>
                );
              })
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <div>
                    <p className="text-yellow-800 font-medium">Pilihan jawaban tidak tersedia</p>
                    <p className="text-yellow-600 text-sm">Soal ini mungkin belum memiliki pilihan jawaban yang valid.</p>
                    <details className="mt-2">
                      <summary className="text-yellow-600 text-xs cursor-pointer">Debug Info</summary>
                      <pre className="text-xs mt-1 bg-yellow-100 p-2 rounded overflow-auto">
                        {JSON.stringify({
                          fullQuestionObject: question,
                          options_json: question?.options_json,
                          Options: question?.Options,
                          options: question?.options,
                          optionsData: optionsData,
                          parsedOptions: options,
                          optionsLength: options?.length
                        }, null, 2)}
                      </pre>
                    </details>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizQuestion;
