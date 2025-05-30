import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

// Icon component for Quiz
const QuizIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v11a2 2 0 002 2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.707.293H19a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
  </svg>
);

// Icon component for Play
const PlayIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m-9 5a9 9 0 1118 0 9 9 0 01-18 0z" />
  </svg>
);

const KuisSiswa = () => {
  const navigate = useNavigate();
  const [kuisList, setKuisList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Page configuration
  const pageConfig = {
    icon: QuizIcon,
    gradient: "from-blue-500 to-indigo-600",
    description: "Pilih kuis yang ingin Anda kerjakan dan uji kemampuan Anda",
    stats: true
  };

  const fetchKuisList = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch("https://brainquiz0.up.railway.app/kuis/get-kuis", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const responseData = await response.json();
        if (responseData.success && responseData.data) {
          setKuisList(responseData.data);
          setError("");
        }
      } else {
        if (response.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }
        setError("Gagal mengambil data kuis");
      }
    } catch (err) {
      setError("Terjadi kesalahan saat mengambil data");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchKuisList();
  }, [fetchKuisList]);

  const handleStartQuiz = (kuisId) => {
    navigate(`/kuis-siswa/${kuisId}/jawab`);
  };

  const handleViewResult = (kuisId) => {
    navigate(`/hasil-kuis/${kuisId}`);
  };

  const getDifficultyColor = (tingkatanName) => {
    const name = (tingkatanName || "").toLowerCase();
    if (name.includes("mudah") || name.includes("easy")) return "text-green-600 bg-green-100";
    if (name.includes("sedang") || name.includes("medium")) return "text-yellow-600 bg-yellow-100";
    if (name.includes("sulit") || name.includes("hard")) return "text-red-600 bg-red-100";
    return "text-gray-600 bg-gray-100";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className={`bg-gradient-to-r ${pageConfig.gradient} px-8 py-6`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <QuizIcon className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-white mb-1">Kuis Tersedia</h1>
                    <p className="text-white/80">{pageConfig.description}</p>
                  </div>
                </div>
                <div className="hidden md:flex items-center space-x-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{kuisList.length}</div>
                    <div className="text-white/80 text-sm">Kuis Tersedia</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Section */}
            <div className="bg-gray-50 px-8 py-4 border-t border-gray-100">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Total Kuis: <span className="font-semibold text-gray-900">{kuisList.length}</span></span>
                <span className="text-gray-600">Status: <span className="font-semibold text-blue-600">Siap Dikerjakan</span></span>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 animate-fade-in">
            <div className="bg-red-50 border-l-4 border-red-500 rounded-xl p-4 shadow-md">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-red-700 font-medium">{error}</span>
              </div>
            </div>
          </div>
        )}

        {/* Quiz Grid */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              <p className="text-gray-600">Memuat daftar kuis...</p>
            </div>
          ) : kuisList.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <QuizIcon className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Belum Ada Kuis</h3>
              <p className="text-gray-500 mb-6">Saat ini belum ada kuis yang tersedia untuk dikerjakan</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {kuisList.map((kuis, index) => (
                <div
                  key={kuis.ID || kuis.id}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200 transform hover:-translate-y-2 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Card Header */}
                  <div className={`bg-gradient-to-r ${pageConfig.gradient} p-4`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                          <QuizIcon className="w-4 h-4 text-white" />
                        </div>
                        <div className="text-white font-semibold truncate">
                          {kuis.title || kuis.Title || 'Kuis'}
                        </div>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(kuis.tingkatan_name)}`}>
                        {kuis.tingkatan_name || 'Normal'}
                      </div>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6">
                    <div className="space-y-4">
                      <div>
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                          Deskripsi
                        </div>
                        <div className="text-gray-900 font-medium">
                          <p className="text-sm leading-relaxed line-clamp-3">
                            {kuis.description || kuis.Description || 'Tidak ada deskripsi'}
                          </p>
                        </div>
                      </div>

                      {/* Quiz Info */}
                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Kategori</div>
                          <div className="text-sm font-medium text-blue-600">
                            {kuis.kategori_name || 'Umum'}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Pendidikan</div>
                          <div className="text-sm font-medium text-indigo-600">
                            {kuis.pendidikan_name || 'Umum'}
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="text-xs text-gray-500 mb-1">Kelas</div>
                        <div className="text-sm font-medium text-purple-600">
                          {kuis.kelas_name || 'Semua Kelas'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleStartQuiz(kuis.ID || kuis.id)}
                        className={`flex-1 px-4 py-3 rounded-xl bg-gradient-to-r ${pageConfig.gradient} text-white font-semibold hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-200 transform hover:scale-105`}
                      >
                        <span className="flex items-center justify-center space-x-2">
                          <PlayIcon className="w-5 h-5" />
                          <span>Mulai Kuis</span>
                        </span>
                      </button>
                      <button
                        onClick={() => handleViewResult(kuis.ID || kuis.id)}
                        className="flex-1 px-4 py-3 rounded-xl bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-300 transition-all duration-200 transform hover:scale-105"
                      >
                        <span className="flex items-center justify-center space-x-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                          </svg>
                          <span>Lihat Hasil</span>
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KuisSiswa;
