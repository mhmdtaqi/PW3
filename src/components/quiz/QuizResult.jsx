import React from 'react';
import { useNavigate } from 'react-router-dom';

const QuizResult = ({ result, className = '' }) => {
  const navigate = useNavigate();

  if (!result) {
    return null;
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-8 flex items-center justify-center ${className}`}>
      <div className="max-w-2xl w-full">
        <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-xl text-center animate-scale-in">
          <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          <h2 className="text-3xl font-bold text-slate-800 mb-4">Kuis Selesai! 🎉</h2>
          <p className="text-xl text-slate-600 mb-8">Terima kasih telah mengerjakan kuis ini.</p>
          
          {/* Score Display */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-blue-50 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-blue-800 mb-2">Skor Anda</h3>
              <p className="text-3xl font-black text-blue-600">{result.score}%</p>
            </div>
            <div className="bg-green-50 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-green-800 mb-2">Jawaban Benar</h3>
              <p className="text-3xl font-black text-green-600">
                {result.correctAnswers} / {result.totalQuestions}
              </p>
            </div>
            <div className="bg-purple-50 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-purple-800 mb-2">Persentase</h3>
              <p className="text-3xl font-black text-purple-600">{result.percentage}%</p>
            </div>
            <div className={`rounded-2xl p-6 ${result.color || 'bg-slate-50'}`}>
              <h3 className="text-lg font-bold mb-2">Grade</h3>
              <p className="text-3xl font-black">{result.grade || 'N/A'}</p>
            </div>
          </div>

          {/* Performance Message */}
          <div className="mb-8">
            {result.percentage >= 90 && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <p className="text-green-800 font-semibold">🌟 Luar biasa! Anda menguasai materi dengan sangat baik!</p>
              </div>
            )}
            {result.percentage >= 70 && result.percentage < 90 && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-blue-800 font-semibold">👍 Bagus! Anda memahami sebagian besar materi dengan baik!</p>
              </div>
            )}
            {result.percentage >= 50 && result.percentage < 70 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <p className="text-yellow-800 font-semibold">📚 Cukup baik! Masih ada ruang untuk peningkatan.</p>
              </div>
            )}
            {result.percentage < 50 && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-red-800 font-semibold">💪 Jangan menyerah! Coba pelajari materi lagi dan ulangi kuis.</p>
              </div>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/hasil-kuis')}
              className="btn-primary"
            >
              Lihat Semua Hasil
            </button>
            <button
              onClick={() => navigate('/ambil-kuis')}
              className="btn-outline"
            >
              Ambil Kuis Lain
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="btn-outline"
            >
              Ke Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizResult;
