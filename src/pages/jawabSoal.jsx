import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../services/api";

// Icon components
const QuestionIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ClockIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const CheckIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const JawabSoal = () => {
  const { kuisId } = useParams();
  const navigate = useNavigate();

  // State management
  const [soalList, setSoalList] = useState([]);
  const [currentSoalIndex, setCurrentSoalIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [kuisInfo, setKuisInfo] = useState(null);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes default
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);

  // Page configuration
  const pageConfig = {
    icon: QuestionIcon,
    gradient: "from-emerald-500 to-teal-600",
    description: "Jawab semua soal dengan teliti dan submit jawaban Anda",
    stats: true
  };

  const fetchSoalData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.getSoalByKuisID(kuisId);

      if (response.success && response.data) {
        const soalData = response.data.map((soal) => {
          try {
            let options = {};
            if (soal.Options || soal.options_json) {
              options = JSON.parse(soal.Options || soal.options_json);
            }
            return {
              ...soal,
              id: soal.ID || soal.id,
              question: soal.Question || soal.question,
              parsedOptions: options,
            };
          } catch (e) {
            console.error("Error parsing options:", e);
            return {
              ...soal,
              id: soal.ID || soal.id,
              question: soal.Question || soal.question,
              parsedOptions: {},
            };
          }
        });

        setSoalList(soalData);

        // Get kuis info if available
        if (soalData.length > 0) {
          setKuisInfo({
            title: soalData[0].kuis_title || `Kuis ID: ${kuisId}`,
            id: kuisId,
            totalSoal: soalData.length
          });
        }
      } else {
        setError("Tidak ada soal yang ditemukan untuk kuis ini");
      }
    } catch (err) {
      setError("Gagal mengambil data soal");
      console.error("Error fetching soal:", err);
    } finally {
      setLoading(false);
    }
  }, [kuisId]);

  useEffect(() => {
    if (!kuisId) {
      navigate("/kuis-siswa");
      return;
    }
    fetchSoalData();
  }, [kuisId, navigate, fetchSoalData]);

  const handleSubmitAnswers = useCallback(async () => {
    try {
      setSubmitting(true);
      setError("");

      // Get user ID from token or localStorage
      let userId = localStorage.getItem("userId");

      // If no userId in localStorage, try to extract from token
      if (!userId) {
        const token = localStorage.getItem("token");
        if (token) {
          try {
            // Decode JWT token to get user ID
            const payload = JSON.parse(atob(token.split('.')[1]));
            userId = payload.iss || payload.user_id || payload.id;
            console.log("Extracted user ID from token:", userId);

            // Save for future use
            if (userId) {
              localStorage.setItem("userId", userId);
            }
          } catch (e) {
            console.warn("Could not decode token, using default user ID");
          }
        }

        // If still no userId, use default
        if (!userId) {
          userId = 1;
          console.warn("No user ID found, using default:", userId);
        }
      }

      // Format answers according to API specification
      const formattedAnswers = Object.entries(answers).map(([soalId, answer]) => {
        const soalIdInt = parseInt(soalId);
        const userIdInt = parseInt(userId);

        // Validate each answer
        if (isNaN(soalIdInt) || soalIdInt <= 0) {
          throw new Error(`Invalid Soal_id: ${soalId}`);
        }
        if (isNaN(userIdInt) || userIdInt <= 0) {
          throw new Error(`Invalid User_id: ${userId}`);
        }
        if (!answer || typeof answer !== 'string') {
          throw new Error(`Invalid Answer for soal ${soalId}: ${answer}`);
        }

        return {
          Soal_id: soalIdInt,
          User_id: userIdInt,
          Answer: answer
        };
      });

      console.log("User ID being used:", userId);
      console.log("Submitting answers:", formattedAnswers);
      console.log("Total answers:", formattedAnswers.length);

      // Validate that we have answers to submit
      if (formattedAnswers.length === 0) {
        throw new Error("Tidak ada jawaban untuk dikirim");
      }

      // Additional validation
      const invalidAnswers = formattedAnswers.filter(ans =>
        !ans.Soal_id || !ans.User_id || !ans.Answer
      );

      if (invalidAnswers.length > 0) {
        console.error("Invalid answers found:", invalidAnswers);
        throw new Error("Beberapa jawaban tidak valid");
      }

      const response = await fetch("https://brainquiz0.up.railway.app/hasil-kuis/submit-jawaban", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formattedAnswers),
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);

      if (response.ok) {
        const result = await response.json();
        console.log("Submit result:", result);

        alert("Jawaban berhasil dikirim!");
        // Navigate to hasil kuis page
        navigate(`/hasil-kuis/${kuisId}`);
      } else {
        // Try to get error details from response
        let errorMessage = "Gagal mengirim jawaban";
        try {
          const errorData = await response.json();
          console.log("Error response:", errorData);
          errorMessage = errorData.message || errorData.error || `Server error: ${response.status}`;
        } catch (e) {
          // If response is not JSON, use status text
          errorMessage = `Server error: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }
    } catch (err) {
      console.error("Error submitting answers:", err);
      setError(err.message || "Terjadi kesalahan saat mengirim jawaban");

      // Don't navigate away on error, let user try again
      setShowConfirmSubmit(false);
    } finally {
      setSubmitting(false);
    }
  }, [answers, navigate, kuisId]);

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0 && soalList.length > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleSubmitAnswers();
    }
  }, [timeLeft, soalList.length, handleSubmitAnswers]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (soalId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [soalId]: answer
    }));
  };

  const handleNextSoal = () => {
    if (currentSoalIndex < soalList.length - 1) {
      setCurrentSoalIndex(currentSoalIndex + 1);
    }
  };

  const handlePrevSoal = () => {
    if (currentSoalIndex > 0) {
      setCurrentSoalIndex(currentSoalIndex - 1);
    }
  };

  const handleSoalNavigation = (index) => {
    setCurrentSoalIndex(index);
  };

  const getAnsweredCount = () => {
    return Object.keys(answers).length;
  };

  const isAnswered = (soalId) => {
    return Object.prototype.hasOwnProperty.call(answers, soalId);
  };

  const currentSoal = soalList[currentSoalIndex];
  const progress = soalList.length > 0 ? ((currentSoalIndex + 1) / soalList.length) * 100 : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
          <p className="text-gray-600">Memuat soal kuis...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Terjadi Kesalahan</h3>
          <p className="text-gray-500 mb-6">{error}</p>
          <button
            onClick={() => navigate("/kuis-siswa")}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all duration-200"
          >
            Kembali ke Daftar Kuis
          </button>
        </div>
      </div>
    );
  }

  if (soalList.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <QuestionIcon className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Tidak Ada Soal</h3>
          <p className="text-gray-500 mb-6">Kuis ini belum memiliki soal yang dapat dikerjakan</p>
          <button
            onClick={() => navigate("/kuis-siswa")}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all duration-200"
          >
            Kembali ke Daftar Kuis
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className={`bg-gradient-to-r ${pageConfig.gradient} px-6 py-4`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <QuestionIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-white">
                      {kuisInfo ? kuisInfo.title : `Kuis ID: ${kuisId}`}
                    </h1>
                    <p className="text-white/80 text-sm">
                      Soal {currentSoalIndex + 1} dari {soalList.length}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  {/* Timer */}
                  <div className="flex items-center space-x-2 bg-white/20 rounded-lg px-3 py-2">
                    <ClockIcon className="w-5 h-5 text-white" />
                    <span className="text-white font-semibold">{formatTime(timeLeft)}</span>
                  </div>

                  {/* Progress */}
                  <div className="text-white text-sm">
                    <div className="text-right mb-1">
                      {getAnsweredCount()}/{soalList.length} Terjawab
                    </div>
                    <div className="w-32 bg-white/20 rounded-full h-2">
                      <div
                        className="bg-white h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(getAnsweredCount() / soalList.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Question Navigation Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Navigasi Soal</h3>
              <div className="grid grid-cols-5 lg:grid-cols-4 gap-2">
                {soalList.map((soal, index) => (
                  <button
                    key={soal.id}
                    onClick={() => handleSoalNavigation(index)}
                    className={`w-10 h-10 rounded-lg font-semibold text-sm transition-all duration-200 ${
                      index === currentSoalIndex
                        ? 'bg-emerald-500 text-white shadow-lg'
                        : isAnswered(soal.id)
                        ? 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <button
                  onClick={() => setShowConfirmSubmit(true)}
                  disabled={submitting || getAnsweredCount() === 0}
                  className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {submitting ? "Mengirim..." : "Submit Jawaban"}
                </button>
              </div>
            </div>
          </div>

          {/* Main Question Area */}
          <div className="lg:col-span-3">
            {currentSoal && (
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-fade-in">
                {/* Question Header */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">
                      Soal {currentSoalIndex + 1}
                    </h2>
                    <div className="flex items-center space-x-2">
                      {isAnswered(currentSoal.id) && (
                        <div className="flex items-center space-x-1 text-green-600">
                          <CheckIcon className="w-4 h-4" />
                          <span className="text-sm font-medium">Terjawab</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Question Content */}
                <div className="p-6">
                  {/* Question Text */}
                  <div className="mb-8">
                    <div className="text-lg font-medium text-gray-900 leading-relaxed">
                      {currentSoal.question}
                    </div>
                  </div>

                  {/* Answer Options */}
                  <div className="space-y-4">
                    {currentSoal.parsedOptions && Object.entries(currentSoal.parsedOptions).map(([key, value]) => (
                      <label
                        key={key}
                        className={`block p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                          answers[currentSoal.id] === key
                            ? 'border-emerald-500 bg-emerald-50 shadow-md'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <input
                            type="radio"
                            name={`soal-${currentSoal.id}`}
                            value={key}
                            checked={answers[currentSoal.id] === key}
                            onChange={() => handleAnswerSelect(currentSoal.id, key)}
                            className="w-5 h-5 text-emerald-600 focus:ring-emerald-500"
                          />
                          <div className="flex items-center space-x-3">
                            <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                              answers[currentSoal.id] === key
                                ? 'bg-emerald-500 text-white'
                                : 'bg-gray-200 text-gray-600'
                            }`}>
                              {key}
                            </span>
                            <span className="text-gray-900 font-medium">{value}</span>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Navigation Footer */}
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
                  <div className="flex justify-between items-center">
                    <button
                      onClick={handlePrevSoal}
                      disabled={currentSoalIndex === 0}
                      className="px-6 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      ← Sebelumnya
                    </button>

                    <div className="text-sm text-gray-600">
                      Progress: {Math.round(progress)}%
                    </div>

                    <button
                      onClick={handleNextSoal}
                      disabled={currentSoalIndex === soalList.length - 1}
                      className="px-6 py-2 bg-emerald-500 text-white font-semibold rounded-lg hover:bg-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Selanjutnya →
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Confirmation Modal */}
        {showConfirmSubmit && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-scale-up">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-yellow-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Konfirmasi Submit</h3>
                <p className="text-gray-600 mb-6">
                  Anda telah menjawab {getAnsweredCount()} dari {soalList.length} soal.
                  Apakah Anda yakin ingin mengirim jawaban?
                </p>
                <div className="flex space-x-4">
                  <button
                    onClick={() => setShowConfirmSubmit(false)}
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-all duration-200"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleSubmitAnswers}
                    disabled={submitting}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-200 disabled:opacity-50"
                  >
                    {submitting ? "Mengirim..." : "Ya, Submit"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JawabSoal;
