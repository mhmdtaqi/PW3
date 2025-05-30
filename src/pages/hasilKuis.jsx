import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";

// Icon components
const TrophyIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
  </svg>
);

const CheckIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const XIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const ClockIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const HasilKuis = () => {
  const { kuisId } = useParams();
  const navigate = useNavigate();

  // State management
  const [hasilData, setHasilData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Page configuration
  const pageConfig = {
    icon: TrophyIcon,
    gradient: "from-yellow-500 to-orange-600",
    description: "Lihat hasil dan skor kuis yang telah Anda kerjakan",
    stats: true
  };

  const fetchHasilKuis = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      // Get user ID
      let userId = localStorage.getItem("userId");
      if (!userId) {
        const token = localStorage.getItem("token");
        if (token) {
          try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            userId = payload.iss || payload.user_id || payload.id;
            if (userId) {
              localStorage.setItem("userId", userId);
            }
          } catch (e) {
            console.warn("Could not decode token");
          }
        }

        if (!userId) {
          setError("User ID tidak ditemukan. Silakan login ulang.");
          return;
        }
      }

      console.log("Fetching hasil for user:", userId, "kuis:", kuisId);

      const response = await fetch(`https://brainquiz0.up.railway.app/hasil-kuis/${userId}/${kuisId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      console.log("Response status:", response.status);

      if (response.ok) {
        const responseData = await response.json();
        console.log("Hasil data:", responseData);

        if (responseData.success && responseData.data) {
          setHasilData(responseData.data);
        } else {
          setError(responseData.message || "Data hasil tidak ditemukan");
        }
      } else {
        if (response.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        } else if (response.status === 404) {
          setError("Hasil kuis tidak ditemukan. Mungkin Anda belum mengerjakan kuis ini.");
        } else {
          setError(`Gagal mengambil data hasil: ${response.status}`);
        }
      }
    } catch (err) {
      console.error("Error fetching hasil:", err);
      setError("Terjadi kesalahan saat mengambil data hasil");
    } finally {
      setLoading(false);
    }
  }, [kuisId, navigate]);

  useEffect(() => {
    if (!kuisId) {
      navigate("/kuis-siswa");
      return;
    }
    fetchHasilKuis();
  }, [kuisId, navigate, fetchHasilKuis]);

  const getScoreGradient = (score) => {
    if (score >= 80) return "from-green-500 to-emerald-600";
    if (score >= 60) return "from-yellow-500 to-orange-600";
    return "from-red-500 to-pink-600";
  };

  const getPerformanceText = (score) => {
    if (score >= 90) return "Luar Biasa!";
    if (score >= 80) return "Sangat Baik!";
    if (score >= 70) return "Baik!";
    if (score >= 60) return "Cukup";
    return "Perlu Perbaikan";
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch (e) {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-yellow-200 border-t-yellow-600 rounded-full animate-spin"></div>
          <p className="text-gray-600">Memuat hasil kuis...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <XIcon className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Terjadi Kesalahan</h3>
          <p className="text-gray-500 mb-6">{error}</p>
          <div className="flex space-x-4">
            <button
              onClick={() => navigate("/kuis-siswa")}
              className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 transition-all duration-200"
            >
              Kembali ke Kuis
            </button>
            <button
              onClick={fetchHasilKuis}
              className="flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all duration-200"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!hasilData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <TrophyIcon className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Hasil Tidak Ditemukan</h3>
          <p className="text-gray-500 mb-6">Anda belum mengerjakan kuis ini atau hasil belum tersedia</p>
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

  const score = hasilData.score || 0;
  const correctAnswers = hasilData["correct_answer;constraint:OnDelete:CASCADE;"] || hasilData.correct_answer || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className={`bg-gradient-to-r ${pageConfig.gradient} px-8 py-6`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <TrophyIcon className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-white mb-1">Hasil Kuis</h1>
                    <p className="text-white/80">{pageConfig.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => navigate("/kuis-siswa")}
                  className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white font-medium rounded-lg hover:bg-white/30 transition-all duration-200"
                >
                  ← Kembali
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Score Card */}
        <div className="mb-8 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className={`bg-gradient-to-r ${getScoreGradient(score)} px-8 py-12 text-center`}>
              <div className="w-24 h-24 mx-auto mb-6 bg-white/20 rounded-full flex items-center justify-center">
                <TrophyIcon className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-4xl font-bold text-white mb-2">{score}</h2>
              <p className="text-white/80 text-lg mb-4">Skor Anda</p>
              <div className="inline-flex items-center px-4 py-2 bg-white/20 rounded-full">
                <span className="text-white font-semibold">{getPerformanceText(score)}</span>
              </div>
            </div>

            {/* Score Details */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-3 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckIcon className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="text-2xl font-bold text-green-600 mb-1">{correctAnswers}</div>
                  <div className="text-gray-600 text-sm">Jawaban Benar</div>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-3 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-lg">%</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-600 mb-1">{score}%</div>
                  <div className="text-gray-600 text-sm">Persentase</div>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-3 bg-purple-100 rounded-full flex items-center justify-center">
                    <ClockIcon className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="text-2xl font-bold text-purple-600 mb-1">
                    {formatDate(hasilData.UpdatedAt || hasilData.CreatedAt).split(' ')[0]}
                  </div>
                  <div className="text-gray-600 text-sm">Tanggal</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quiz Info */}
        <div className="mb-8 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Informasi Kuis</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  ID Kuis
                </div>
                <div className="text-gray-900 font-medium">
                  #{hasilData.kuis_id}
                </div>
              </div>

              <div>
                <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Dikerjakan Pada
                </div>
                <div className="text-gray-900 font-medium">
                  {formatDate(hasilData.CreatedAt)}
                </div>
              </div>

              <div>
                <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Terakhir Update
                </div>
                <div className="text-gray-900 font-medium">
                  {formatDate(hasilData.UpdatedAt)}
                </div>
              </div>

              <div>
                <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  User ID
                </div>
                <div className="text-gray-900 font-medium">
                  #{hasilData.users_id}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-center space-x-4 animate-fade-in">
          <button
            onClick={() => navigate("/kuis-siswa")}
            className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-300 transition-all duration-200 transform hover:scale-105"
          >
            Kembali ke Daftar Kuis
          </button>
          <button
            onClick={() => navigate(`/kuis-siswa/${kuisId}/jawab`)}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-200 transform hover:scale-105"
          >
            Kerjakan Ulang
          </button>
        </div>
      </div>
    </div>
  );
};

export default HasilKuis;
