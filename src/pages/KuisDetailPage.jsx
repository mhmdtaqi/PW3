import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Use the same BASE_URL logic as other components
const BASE_URL = import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? "/api" : "https://brainquiz0.up.railway.app");

const KuisDetailPage = () => {
  const { kuisId } = useParams();
  const navigate = useNavigate();
  const [kuis, setKuis] = useState(null);
  const [soalList, setSoalList] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState(null);

  // Get user info
  const getUserInfo = () => {
    const storedUserId = localStorage.getItem('userId');
    const storedUserName = localStorage.getItem('userName');
    
    if (storedUserId) {
      return {
        userId: storedUserId,
        userName: storedUserName || 'User'
      };
    }
    
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return {
          userId: payload.iss || payload.user_id || payload.id || payload.sub,
          userName: payload.name || storedUserName || 'User'
        };
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
    
    return {
      userId: null,
      userName: storedUserName || 'User'
    };
  };

  const { userId, userName } = getUserInfo();

  useEffect(() => {
    fetchKuisDetail();
    fetchSoal();
  }, [kuisId]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0 && !showResult) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResult) {
      handleSubmit();
    }
  }, [timeLeft, showResult]);

  const fetchKuisDetail = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}/kuis/get-kuis`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        const kuisDetail = data.data.find(k => k.ID === parseInt(kuisId));
        setKuis(kuisDetail);
      }
    } catch (error) {
      console.error('Error fetching kuis detail:', error);
    }
  };

  const fetchSoal = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}/soal/get-soal/${kuisId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setSoalList(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching soal:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (soalId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [soalId]: answer
    }));
  };

  const handleSubmit = async () => {
    if (!userId) {
      alert('User ID tidak ditemukan. Silakan login ulang.');
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      
      // Format answers according to backend expectation
      const formattedAnswers = soalList.map(soal => ({
        soal_id: soal.ID,
        answer: answers[soal.ID] || '',
        user_id: parseInt(userId)
      }));

      console.log('Submitting answers:', formattedAnswers);

      const response = await fetch(`${BASE_URL}/hasil-kuis/submit-jawaban`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formattedAnswers),
      });

      const data = await response.json();
      console.log('Submit response:', data);

      if (response.ok) {
        setResult(data.data);
        setShowResult(true);
      } else {
        alert(data.message || 'Gagal mengirim jawaban');
      }
    } catch (error) {
      console.error('Error submitting answers:', error);
      alert('Terjadi kesalahan saat mengirim jawaban');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getAnsweredCount = () => {
    return Object.keys(answers).length;
  };

  const parseOptions = (optionsJson) => {
    try {
      if (typeof optionsJson === 'string') {
        return JSON.parse(optionsJson);
      }
      return optionsJson;
    } catch (error) {
      console.error('Error parsing options:', error);
      return [];
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Memuat soal kuis...</p>
        </div>
      </div>
    );
  }

  if (showResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-8 flex items-center justify-center">
        <div className="max-w-2xl w-full">
          <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-xl text-center animate-scale-in">
            <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Kuis Selesai! 🎉</h2>
            <p className="text-xl text-slate-600 mb-8">Terima kasih telah mengerjakan kuis ini.</p>
            
            {result && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-blue-50 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-blue-800 mb-2">Skor Anda</h3>
                  <p className="text-3xl font-black text-blue-600">{result.score || 0}</p>
                </div>
                <div className="bg-green-50 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-green-800 mb-2">Jawaban Benar</h3>
                  <p className="text-3xl font-black text-green-600">{result.correct_answer || 0} / {soalList.length}</p>
                </div>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/daftar-kuis')}
                className="btn-primary"
              >
                Kembali ke Daftar Kuis
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
  }

  if (!kuis || soalList.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Kuis tidak ditemukan</h3>
          <p className="text-slate-600 mb-6">Kuis yang Anda cari tidak tersedia atau belum memiliki soal.</p>
          <button
            onClick={() => navigate('/daftar-kuis')}
            className="btn-primary"
          >
            Kembali ke Daftar Kuis
          </button>
        </div>
      </div>
    );
  }

  const currentSoal = soalList[currentQuestion];
  const options = parseOptions(currentSoal?.options_json || currentSoal?.Options);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-8">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">{kuis.title}</h1>
            <p className="text-slate-600">{kuis.description}</p>
          </div>
          
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            {/* Timer */}
            <div className="bg-white/60 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className={`font-mono font-bold ${timeLeft < 300 ? 'text-red-500' : 'text-slate-700'}`}>
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>
            
            {/* Progress */}
            <div className="bg-white/60 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg">
              <span className="text-sm font-semibold text-slate-700">
                {getAnsweredCount()} / {soalList.length} dijawab
              </span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / soalList.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Question */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg mb-8 animate-slide-up">
          <div className="flex items-start space-x-4 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold">
              {currentQuestion + 1}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-slate-800 mb-4">{currentSoal.question}</h2>
              
              {/* Options */}
              <div className="space-y-3">
                {options && options.map((option, index) => (
                  <label
                    key={index}
                    className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                      answers[currentSoal.ID] === option
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question-${currentSoal.ID}`}
                      value={option}
                      checked={answers[currentSoal.ID] === option}
                      onChange={(e) => handleAnswerChange(currentSoal.ID, e.target.value)}
                      className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                    />
                    <span className="ml-3 text-slate-700 font-medium">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center animate-scale-in">
          <button
            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
            disabled={currentQuestion === 0}
            className="btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Sebelumnya
          </button>

          <div className="flex space-x-2">
            {soalList.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestion(index)}
                className={`w-10 h-10 rounded-lg font-semibold transition-all duration-200 ${
                  index === currentQuestion
                    ? 'bg-blue-500 text-white'
                    : answers[soalList[index].ID]
                    ? 'bg-green-100 text-green-700 border border-green-300'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          {currentQuestion === soalList.length - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Mengirim...</span>
                </div>
              ) : (
                'Selesai'
              )}
            </button>
          ) : (
            <button
              onClick={() => setCurrentQuestion(Math.min(soalList.length - 1, currentQuestion + 1))}
              className="btn-primary"
            >
              Selanjutnya →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default KuisDetailPage;
