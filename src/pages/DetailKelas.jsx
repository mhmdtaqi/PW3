import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { api } from "../services/api";

const DetailKelas = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [kelas, setKelas] = useState(null);
  const [kuisList, setKuisList] = useState([]);
  const [selectedKuis, setSelectedKuis] = useState(null);
  const [soalList, setSoalList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(null);
  const [correctAnswers, setCorrectAnswers] = useState({});
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Ambil semua kelas
        const allKelas = await api.getKelas();
        console.log("Semua kelas:", allKelas);

        // Cari kelas berdasarkan ID dari data yang sudah ada
        const kelasData = allKelas.data.find(
          (k) => k.ID === parseInt(id) || k.id === parseInt(id)
        );

        if (!kelasData) {
          throw new Error("Kelas tidak ditemukan");
        }

        setKelas(kelasData);

        // Ambil data kuis
        const kuisData = await api.getKuis();
        const filteredKuis = kuisData.data.filter(
          (kuis) => kuis.kelas_id === parseInt(id)
        );
        setKuisList(filteredKuis);

        // Ambil role dari localStorage
        const userRole = localStorage.getItem("role");
        setUserRole(userRole);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message || "Terjadi kesalahan saat mengambil data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleKuisClick = async (kuis) => {
    try {
      setLoading(true);
      console.log("Mengambil soal untuk kuis ID:", kuis.ID || kuis.id);

      if (!kuis.ID && !kuis.id) {
        throw new Error("ID kuis tidak valid");
      }

      const soalResponse = await api.getSoalByKuisID(kuis.ID || kuis.id);
      console.log("Response soal lengkap:", soalResponse);

      if (!soalResponse.success) {
        throw new Error(soalResponse.message || "Gagal memuat soal");
      }

      // Simpan jawaban yang benar
      const correctAnswersMap = {};
      soalResponse.data.forEach((soal) => {
        correctAnswersMap[soal.ID || soal.id] = soal.correct_answer;
      });
      setCorrectAnswers(correctAnswersMap);

      setSoalList(soalResponse.data);
      setSelectedKuis(kuis);
      setAnswers({});
      setShowResults(false);
      setScore(null);
    } catch (err) {
      console.error("Error dalam handleKuisClick:", err);
      setError(err.message || "Gagal memuat soal");
      setSoalList([]);
      setSelectedKuis(null);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (soalId, answer) => {
    setAnswers((prev) => ({
      ...prev,
      [soalId]: answer,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      // Validasi semua soal telah dijawab
      const unansweredQuestions = soalList.filter(
        (soal) => !answers[soal.ID || soal.id]
      );

      if (unansweredQuestions.length > 0) {
        setError("Mohon jawab semua soal terlebih dahulu");
        return;
      }

      // Format jawaban sesuai dengan yang diharapkan API
      const formattedAnswers = Object.entries(answers).map(
        ([soalId, answer]) => ({
          soal_id: parseInt(soalId),
          selected_answer: answer,
          kuis_id: parseInt(selectedKuis.ID || selectedKuis.id),
        })
      );

      console.log("Mengirim jawaban:", formattedAnswers);

      const response = await api.submitJawaban(
        selectedKuis.ID || selectedKuis.id,
        formattedAnswers
      );

      if (!response.success) {
        throw new Error(response.message || "Gagal mengirim jawaban");
      }

      console.log("Response submit jawaban:", response);
      setScore(response.data);
      setShowResults(true);
    } catch (err) {
      console.error("Error dalam handleSubmit:", err);
      setError(err.message || "Gagal mengirim jawaban");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="spinner w-12 h-12 mx-auto"></div>
          <p className="text-gray-600 font-medium">Memuat data kelas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center">
        <div className="text-center space-y-4 p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Terjadi Kesalahan</h3>
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  if (!kelas) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center space-y-4 p-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Kelas Tidak Ditemukan</h3>
          <p className="text-gray-600">Kelas yang Anda cari tidak tersedia</p>
          <Link to="/daftar-kelas" className="btn-primary">
            Kembali ke Daftar Kelas
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <button
            onClick={() => navigate("/daftar-kelas")}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 mb-6 transition-colors duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-medium">Kembali ke Daftar Kelas</span>
          </button>

          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white/20">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="mb-6 lg:mb-0">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
                  {kelas.name}
                </h1>
                <p className="text-gray-600 text-lg leading-relaxed max-w-2xl">
                  {kelas.description}
                </p>
                <div className="flex items-center space-x-4 mt-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <span>{kuisList.length} Kuis Tersedia</span>
                  </div>
                </div>
              </div>

              {/* Admin/Teacher Actions */}
              {(userRole === "admin" || userRole === "teacher") && (
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                  <Link
                    to={`/admin/manage-kuis?kelas_id=${id}`}
                    className="btn-secondary flex items-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>Tambah Kuis</span>
                  </Link>
                  {selectedKuis && (
                    <Link
                      to={`/admin/manage-soal?kuis_id=${selectedKuis.ID || selectedKuis.id}`}
                      className="btn-primary flex items-center space-x-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      <span>Kelola Soal</span>
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Daftar Kuis */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-white/20 animate-slide-up">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-800">Daftar Kuis</h2>
              </div>

              {kuisList.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Belum Ada Kuis</h3>
                  <p className="text-gray-500">Kuis akan muncul di sini setelah ditambahkan oleh pengajar</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {kuisList.map((kuis, index) => (
                    <div
                      key={kuis.ID || kuis.id}
                      className={`group p-4 rounded-xl cursor-pointer transition-all duration-300 animate-scale-in ${
                        selectedKuis?.ID === kuis.ID || selectedKuis?.id === kuis.id
                          ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 shadow-lg"
                          : "bg-gray-50 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 border-2 border-transparent hover:border-blue-100 hover:shadow-md"
                      }`}
                      style={{ animationDelay: `${index * 0.1}s` }}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleKuisClick(kuis);
                      }}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          selectedKuis?.ID === kuis.ID || selectedKuis?.id === kuis.id
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600"
                        } transition-colors duration-300`}>
                          <span className="font-bold text-sm">{index + 1}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className={`font-semibold text-sm mb-1 ${
                            selectedKuis?.ID === kuis.ID || selectedKuis?.id === kuis.id
                              ? "text-blue-700"
                              : "text-gray-800 group-hover:text-blue-600"
                          } transition-colors duration-300`}>
                            {kuis.title}
                          </h3>
                          <p className="text-xs text-gray-600 line-clamp-2">
                            {kuis.description}
                          </p>
                        </div>
                        {selectedKuis?.ID === kuis.ID || selectedKuis?.id === kuis.id && (
                          <div className="flex-shrink-0">
                            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Detail Kuis dan Soal */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-white/20 animate-slide-up">
              {selectedKuis ? (
                <>
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">
                        {selectedKuis.title}
                      </h2>
                      <p className="text-gray-600">{selectedKuis.description}</p>
                    </div>
                  </div>

                  {!showResults ? (
                    <div className="space-y-6">
                      {soalList && soalList.length > 0 ? (
                        <>
                          {/* Progress Bar */}
                          <div className="bg-gray-200 rounded-full h-2 mb-6">
                            <div
                              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                              style={{
                                width: `${(Object.keys(answers).length / soalList.length) * 100}%`
                              }}
                            ></div>
                          </div>
                          <div className="text-sm text-gray-600 mb-6">
                            Progres: {Object.keys(answers).length} dari {soalList.length} soal terjawab
                          </div>

                          {soalList.map((soal, index) => {
                            let options = [];
                            try {
                              if (soal.options_json) {
                                const parsedOptions = JSON.parse(soal.options_json);
                                if (
                                  parsedOptions &&
                                  Object.keys(parsedOptions).length > 0
                                ) {
                                  options = Object.entries(parsedOptions).map(
                                    ([key, value]) => ({
                                      key,
                                      value,
                                    })
                                  );
                                }
                              }
                            } catch (err) {
                              console.error(
                                `Error parsing options untuk soal ${index + 1}:`,
                                err
                              );
                              options = [];
                            }

                            const isAnswered = answers[soal.ID || soal.id];

                            return (
                              <div
                                key={soal.ID || soal.id}
                                className={`border-2 rounded-2xl p-6 transition-all duration-300 animate-scale-in ${
                                  isAnswered
                                    ? "border-green-200 bg-green-50/50"
                                    : "border-gray-200 bg-white hover:border-blue-200 hover:shadow-md"
                                }`}
                                style={{ animationDelay: `${index * 0.1}s` }}
                              >
                                <div className="flex items-start space-x-4 mb-6">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                    isAnswered
                                      ? "bg-green-500 text-white"
                                      : "bg-blue-100 text-blue-600"
                                  } transition-colors duration-300`}>
                                    {isAnswered ? (
                                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                      </svg>
                                    ) : (
                                      <span className="font-bold text-sm">{index + 1}</span>
                                    )}
                                  </div>
                                  <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                      Soal {index + 1}
                                    </h3>
                                    <p className="text-gray-700 leading-relaxed">
                                      {soal.question}
                                    </p>
                                  </div>
                                </div>

                                {options.length > 0 ? (
                                  <div className="space-y-3">
                                    {options.map((option, optIndex) => (
                                      <label
                                        key={optIndex}
                                        className={`flex items-center space-x-4 p-4 rounded-xl cursor-pointer border-2 transition-all duration-200 ${
                                          answers[soal.ID || soal.id] === option.value
                                            ? "border-blue-500 bg-blue-50 shadow-md"
                                            : "border-gray-200 hover:border-blue-300 hover:bg-blue-50/50"
                                        }`}
                                      >
                                        <input
                                          type="radio"
                                          name={`soal-${soal.ID || soal.id}`}
                                          value={option.value}
                                          checked={
                                            answers[soal.ID || soal.id] ===
                                            option.value
                                          }
                                          onChange={() =>
                                            handleAnswerChange(
                                              soal.ID || soal.id,
                                              option.value
                                            )
                                          }
                                          className="w-5 h-5 text-blue-600 focus:ring-blue-500 focus:ring-2"
                                          disabled={showResults}
                                        />
                                        <span className="flex-1 text-gray-700">
                                          <span className="font-semibold text-blue-600 mr-2">
                                            {option.key}.
                                          </span>
                                          {option.value}
                                        </span>
                                      </label>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="p-4 bg-yellow-50 border-2 border-yellow-200 rounded-xl">
                                    <div className="flex items-center space-x-2">
                                      <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
                                      </svg>
                                      <p className="text-yellow-700 font-medium">
                                        Pilihan jawaban belum tersedia untuk soal ini.
                                      </p>
                                    </div>
                                    <p className="text-yellow-600 text-sm mt-1">
                                      Mohon hubungi pengajar untuk menambahkan pilihan jawaban.
                                    </p>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </>
                      ) : (
                        <div className="text-center py-12">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">Tidak Ada Soal</h3>
                          <p className="text-gray-500">
                            Soal belum tersedia untuk kuis ini
                          </p>
                        </div>
                      )}
                      {soalList && soalList.length > 0 && (
                        <div className="mt-8 pt-6 border-t border-gray-200">
                          {error && (
                            <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 text-red-700 rounded-xl flex items-center space-x-2">
                              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span>{error}</span>
                            </div>
                          )}

                          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                            <div className="text-sm text-gray-600">
                              {Object.keys(answers).length === soalList.length ? (
                                <div className="flex items-center space-x-2 text-green-600">
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  <span className="font-medium">Semua soal telah dijawab!</span>
                                </div>
                              ) : (
                                <span>
                                  Jawab {soalList.length - Object.keys(answers).length} soal lagi untuk menyelesaikan kuis
                                </span>
                              )}
                            </div>

                            <button
                              onClick={handleSubmit}
                              disabled={
                                Object.keys(answers).length !== soalList.length ||
                                loading
                              }
                              className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
                                Object.keys(answers).length === soalList.length && !loading
                                  ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
                              }`}
                            >
                              {loading ? (
                                <div className="flex items-center space-x-2">
                                  <div className="spinner w-5 h-5"></div>
                                  <span>Mengirim Jawaban...</span>
                                </div>
                              ) : (
                                <div className="flex items-center space-x-2">
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                  </svg>
                                  <span>Kirim Jawaban</span>
                                </div>
                              )}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8 animate-fade-in">
                      <div className="mb-8">
                        <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-800 mb-4">Kuis Selesai! 🎉</h3>
                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 mb-6">
                          <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                            Skor: {score.score}
                          </p>
                          <p className="text-lg text-gray-600">
                            Jawaban Benar: <span className="font-semibold text-green-600">{score.correct_answer}</span> dari <span className="font-semibold">{soalList.length}</span> soal
                          </p>
                          <div className="mt-4">
                            <div className="bg-gray-200 rounded-full h-3">
                              <div
                                className="bg-gradient-to-r from-green-400 to-emerald-500 h-3 rounded-full transition-all duration-1000"
                                style={{ width: `${(score.correct_answer / soalList.length) * 100}%` }}
                              ></div>
                            </div>
                            <p className="text-sm text-gray-500 mt-2">
                              Akurasi: {Math.round((score.correct_answer / soalList.length) * 100)}%
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4 mb-8">
                        <h4 className="text-xl font-semibold text-gray-800 mb-4">Review Jawaban</h4>
                        {soalList.map((soal, index) => {
                          const isCorrect = answers[soal.ID || soal.id] === correctAnswers[soal.ID || soal.id];
                          return (
                            <div
                              key={soal.ID || soal.id}
                              className={`border-2 rounded-xl p-4 text-left ${
                                isCorrect
                                  ? "border-green-200 bg-green-50"
                                  : "border-red-200 bg-red-50"
                              }`}
                            >
                              <div className="flex items-start space-x-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                  isCorrect ? "bg-green-500" : "bg-red-500"
                                } text-white`}>
                                  {isCorrect ? (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                  ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  )}
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-semibold text-gray-800 mb-2">
                                    Soal {index + 1}: {soal.question}
                                  </h4>
                                  <div className="space-y-1 text-sm">
                                    <p className={`${isCorrect ? "text-green-700" : "text-red-700"}`}>
                                      <span className="font-medium">Jawaban Anda:</span> {answers[soal.ID || soal.id]}
                                    </p>
                                    {!isCorrect && (
                                      <p className="text-green-700">
                                        <span className="font-medium">Jawaban Benar:</span> {correctAnswers[soal.ID || soal.id]}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <button
                        onClick={() => {
                          setShowResults(false);
                          setAnswers({});
                          setScore(null);
                        }}
                        className="btn-primary"
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Coba Lagi
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Pilih Kuis untuk Memulai</h3>
                  <p className="text-gray-500">Klik salah satu kuis di sebelah kiri untuk mulai mengerjakan</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailKelas;
