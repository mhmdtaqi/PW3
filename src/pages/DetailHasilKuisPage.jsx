import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getConsistentScoreInfo } from '../utils/gradeUtils';

// Use the same BASE_URL logic as other components
const BASE_URL = import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? "/api" : "https://brainquiz0.up.railway.app");

const DetailHasilKuisPage = () => {
  const { kuisId } = useParams();
  const navigate = useNavigate();
  const [kuis, setKuis] = useState(null);
  const [soalList, setSoalList] = useState([]);
  const [hasilKuis, setHasilKuis] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const { userId } = getUserInfo();

  useEffect(() => {
    if (userId && kuisId) {
      fetchData();
    }
  }, [userId, kuisId]);



  const fetchData = async () => {
    try {
      await Promise.all([
        fetchKuisDetail(),
        fetchSoal(),
        fetchHasilKuis()
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Manual calculation is no longer needed since backend now provides consistent percentage-based scoring

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
    }
  };

  const fetchHasilKuis = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}/hasil-kuis/${userId}/${kuisId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setHasilKuis(data.data);
      }
    } catch (error) {
      console.error('Error fetching hasil kuis:', error);
    }
  };

  const parseOptions = (optionsJson) => {
    try {
      if (typeof optionsJson === 'string') {
        return JSON.parse(optionsJson);
      }
      return optionsJson || [];
    } catch (error) {
      console.error('Error parsing options:', error);
      return [];
    }
  };



  const getScoreInfo = () => {
    if (!hasilKuis || !soalList || soalList.length === 0) {
      return {
        score: 0,
        percentage: 0,
        grade: 'E',
        color: 'text-red-600 bg-red-50',
        correctAnswers: 0,
        totalQuestions: soalList?.length || 0
      };
    }

    const rawScore = hasilKuis.score || hasilKuis.Score || 0;
    const correctAnswers = hasilKuis.correct_answer || hasilKuis.Correct_Answer || 0;
    const totalQuestions = soalList.length;

    // Use the consistent score calculation utility
    return getConsistentScoreInfo(rawScore, correctAnswers, totalQuestions);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Memuat detail hasil kuis...</p>
        </div>
      </div>
    );
  }

  if (!hasilKuis) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Hasil kuis tidak ditemukan</h3>
          <p className="text-slate-600 mb-6">Anda belum mengerjakan kuis ini.</p>
          <button
            onClick={() => navigate('/hasil-kuis')}
            className="btn-primary"
          >
            Kembali ke Hasil Kuis
          </button>
        </div>
      </div>
    );
  }

  const scoreInfo = getScoreInfo();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-8">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <div className="flex items-center space-x-4 mb-6">
          <button
            onClick={() => navigate('/hasil-kuis')}
            className="w-10 h-10 bg-white/60 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex-1">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
              Detail Hasil Kuis
            </h1>
            {kuis && (
              <p className="text-xl text-slate-600 font-medium">
                {kuis.title}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Score Summary */}
      <div className="mb-8 animate-scale-in">
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl font-bold text-2xl ${scoreInfo.color} mb-3`}>
                {scoreInfo.grade}
              </div>
              <p className="text-sm font-semibold text-slate-600">Grade</p>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-3">
                {scoreInfo.score}%
              </div>
              <p className="text-sm font-semibold text-slate-600">Skor Persentase</p>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-3">
                {scoreInfo.correctAnswers} / {scoreInfo.totalQuestions}
              </div>
              <p className="text-sm font-semibold text-slate-600">Jawaban Benar</p>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-3">{scoreInfo.percentage}%</div>
              <p className="text-sm font-semibold text-slate-600">Persentase</p>
            </div>
          </div>
        </div>
      </div>

      {/* Questions Review */}
      <div className="space-y-6 animate-bounce-in">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Review Jawaban</h2>
        
        {soalList.map((soal, index) => {
          const options = parseOptions(soal.options_json || soal.Options);
          // Note: We don't have user answers from the API, so we'll show the correct answers
          
          return (
            <div
              key={soal.ID}
              className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-800 mb-4">{soal.question}</h3>
                  
                  <div className="space-y-3">
                    {options.map((option, optIndex) => {
                      const isCorrect = option === soal.correct_answer;
                      
                      return (
                        <div
                          key={optIndex}
                          className={`flex items-center p-4 rounded-xl border-2 ${
                            isCorrect
                              ? 'border-green-500 bg-green-50'
                              : 'border-slate-200 bg-slate-50'
                          }`}
                        >
                          <span className="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                            {String.fromCharCode(65 + optIndex)}
                          </span>
                          <span className="text-slate-700 flex-1">{option}</span>
                          {isCorrect && (
                            <div className="flex items-center space-x-2">
                              <span className="text-green-600 text-sm font-semibold">Jawaban Benar</span>
                              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
        <button
          onClick={() => navigate('/hasil-kuis')}
          className="btn-outline"
        >
          Kembali ke Hasil Kuis
        </button>
        <button
          onClick={() => navigate('/ambil-kuis')}
          className="btn-primary"
        >
          Ambil Kuis Lain
        </button>
      </div>
    </div>
  );
};

export default DetailHasilKuisPage;
