import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { api } from "../../services/api";

const ManageSoal = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const kuisId = searchParams.get("kuis_id");

  const [soalList, setSoalList] = useState([]);
  const [selectedSoal, setSelectedSoal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    question: "",
    options: {
      A: "",
      B: "",
      C: "",
      D: "",
    },
    correct_answer: "",
    kuis_id: kuisId,
  });

  useEffect(() => {
    if (!kuisId) {
      navigate("/daftar-kelas");
      return;
    }
    fetchSoal();
  }, [kuisId]);

  const fetchSoal = async () => {
    try {
      setLoading(true);
      const response = await api.getSoalByKuisID(kuisId);
      console.log("Response getSoalByKuisID:", response);
      if (response.success) {
        const soalList = response.data.map((soal) => {
          try {
            let options = {};
            if (soal.Options || soal.options_json) {
              options = JSON.parse(soal.Options || soal.options_json);
            }
            console.log("Options untuk soal", soal.ID, ":", options);
            return {
              ...soal,
              parsedOptions: options,
              question: soal.Question || soal.question,
              correct_answer: soal.Correct_answer || soal.correct_answer,
            };
          } catch (e) {
            console.error("Error parsing options untuk soal", soal.ID, ":", e);
            return soal;
          }
        });
        console.log("Soal list setelah parsing:", soalList);
        setSoalList(soalList);
      }
    } catch (error) {
      console.error("Error dalam fetchSoal:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (soal) => {
    setSelectedSoal(soal);
    let options = {
      A: "",
      B: "",
      C: "",
      D: "",
    };
    try {
      if (soal.Options) {
        const parsedOptions = JSON.parse(soal.Options);
        if (parsedOptions && typeof parsedOptions === "object") {
          options = parsedOptions;
        }
      }
    } catch (e) {
      console.error("Error parsing options:", e);
    }
    setFormData({
      question: soal.Question || soal.question || "",
      options: options,
      correct_answer: soal.Correct_answer || soal.correct_answer || "",
      kuis_id: soal.Kuis_id || soal.kuis_id || kuisId,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validasi form
      if (!formData.question.trim()) {
        setError("Pertanyaan tidak boleh kosong");
        return;
      }

      if (!formData.correct_answer) {
        setError("Pilih jawaban yang benar");
        return;
      }

      // Validasi semua opsi jawaban harus diisi
      const allOptionsFilled = Object.values(formData.options).every(
        (option) => option.trim() !== ""
      );
      if (!allOptionsFilled) {
        setError("Semua opsi jawaban harus diisi");
        return;
      }

      const soalData = {
        question: formData.question,
        options: formData.options,
        correct_answer: formData.correct_answer,
        kuis_id: parseInt(kuisId),
      };

      console.log("Mengirim data soal:", soalData);

      if (selectedSoal) {
        await api.updateSoal(selectedSoal.ID, soalData);
      } else {
        await api.addSoal(soalData);
      }

      // Reset form
      setFormData({
        question: "",
        options: {
          A: "",
          B: "",
          C: "",
          D: "",
        },
        correct_answer: "",
      });
      setSelectedSoal(null);
      fetchSoal();
    } catch (error) {
      console.error("Error dalam handleSubmit:", error);
      setError(error.message || "Terjadi kesalahan saat menyimpan soal");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus soal ini?")) {
      try {
        setLoading(true);
        await api.deleteSoal(id);
        fetchSoal();
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="spinner w-12 h-12 mx-auto"></div>
          <p className="text-gray-600 font-medium">Memuat data soal...</p>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-800 mb-6 transition-colors duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-medium">Kembali</span>
          </button>

          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white/20">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  {selectedSoal ? "Edit Soal" : "Kelola Soal Kuis"}
                </h1>
                <p className="text-gray-600 mt-1">
                  {selectedSoal ? "Perbarui soal yang sudah ada" : "Tambah dan kelola soal untuk kuis ini"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white/20 mb-8 animate-slide-up">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {selectedSoal ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                )}
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              {selectedSoal ? "Edit Soal" : "Tambah Soal Baru"}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Pertanyaan Soal
              </label>
              <textarea
                value={formData.question}
                onChange={(e) =>
                  setFormData({ ...formData, question: e.target.value })
                }
                className="input-modern min-h-[100px] resize-none"
                rows="4"
                placeholder="Masukkan pertanyaan soal di sini..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-4">
                Pilihan Jawaban
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(formData.options || {}).map(([key, value]) => (
                  <div key={key} className="space-y-2">
                    <label className="text-sm font-medium text-gray-600">
                      Pilihan {key}
                    </label>
                    <input
                      type="text"
                      value={value}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          options: {
                            ...formData.options,
                            [key]: e.target.value,
                          },
                        })
                      }
                      placeholder={`Masukkan pilihan ${key}`}
                      className="input-modern"
                      required
                    />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Jawaban Benar
              </label>
              <select
                value={formData.correct_answer}
                onChange={(e) =>
                  setFormData({ ...formData, correct_answer: e.target.value })
                }
                className="input-modern"
                required
              >
                <option value="">Pilih jawaban yang benar</option>
                {Object.entries(formData.options || {}).map(([key, value]) => (
                  value.trim() && (
                    <option key={key} value={value}>
                      Pilihan {key} - {value}
                    </option>
                  )
                ))}
              </select>
            </div>

            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-6 border-t border-gray-200">
              {selectedSoal && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedSoal(null);
                    setFormData({
                      question: "",
                      options: { A: "", B: "", C: "", D: "" },
                      correct_answer: "",
                      kuis_id: kuisId,
                    });
                  }}
                  className="btn-outline"
                >
                  Batal Edit
                </button>
              )}
              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="spinner w-5 h-5"></div>
                    <span>Menyimpan...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {selectedSoal ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      )}
                    </svg>
                    <span>{selectedSoal ? "Update Soal" : "Tambah Soal"}</span>
                  </div>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Daftar Soal */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white/20 animate-slide-up">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Daftar Soal</h2>
              <p className="text-gray-600">Total: {soalList.length} soal</p>
            </div>
          </div>

          {soalList.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Belum Ada Soal</h3>
              <p className="text-gray-500">Mulai tambahkan soal untuk kuis ini</p>
            </div>
          ) : (
            <div className="space-y-6">
              {soalList.map((soal, index) => {
                let options = {};
                try {
                  if (soal.Options || soal.options_json) {
                    options = JSON.parse(soal.Options || soal.options_json);
                  }
                } catch (e) {
                  console.error(
                    "Error parsing options untuk soal",
                    soal.ID,
                    ":",
                    e
                  );
                }

                const correctAnswer = soal.Correct_answer || soal.correct_answer;

                return (
                  <div
                    key={soal.ID || soal.id}
                    className="border-2 border-gray-200 rounded-2xl p-6 hover:border-indigo-200 hover:shadow-lg transition-all duration-300 animate-scale-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="font-bold">{index + 1}</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-800 mb-3">
                            {soal.Question || soal.question}
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {Object.entries(options).map(([key, value]) => (
                              <div
                                key={key}
                                className={`p-3 rounded-xl border-2 transition-colors duration-200 ${
                                  value === correctAnswer
                                    ? "border-green-300 bg-green-50"
                                    : "border-gray-200 bg-gray-50"
                                }`}
                              >
                                <div className="flex items-center space-x-2">
                                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                                    value === correctAnswer
                                      ? "bg-green-500 text-white"
                                      : "bg-gray-300 text-gray-600"
                                  }`}>
                                    {key}
                                  </span>
                                  <span className="text-gray-700 flex-1">{value}</span>
                                  {value === correctAnswer && (
                                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => handleEdit(soal)}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors duration-200 font-medium"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(soal.ID || soal.id)}
                        className="flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors duration-200 font-medium"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        <span>Hapus</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageSoal;
