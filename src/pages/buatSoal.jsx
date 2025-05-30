import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../services/api";

// Icon component for Soal
const SoalIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const BuatSoal = () => {
  const { kuisId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [kuisInfo, setKuisInfo] = useState(null);
  const [soalList, setSoalList] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    question: "",
    options: {
      A: "",
      B: "",
      C: "",
      D: ""
    },
    correct_answer: ""
  });

  // Page configuration
  const pageConfig = {
    icon: SoalIcon,
    gradient: "from-emerald-500 to-teal-600",
    description: "Kelola soal-soal untuk kuis pembelajaran",
    stats: true
  };

  const fetchSoalData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.getSoalByKuisID(kuisId);

      if (response.success) {
        const soalData = response.data.map((soal) => {
          try {
            let options = {};
            if (soal.Options || soal.options_json) {
              options = JSON.parse(soal.Options || soal.options_json);
            }
            return {
              ...soal,
              parsedOptions: options,
              question: soal.Question || soal.question,
              correct_answer: soal.Correct_answer || soal.correct_answer,
            };
          } catch (e) {
            console.error("Error parsing options:", e);
            return soal;
          }
        });
        setSoalList(soalData);

        // Get kuis info if available
        if (soalData.length > 0) {
          setKuisInfo({
            title: soalData[0].kuis_title || `Kuis ID: ${kuisId}`,
            id: kuisId
          });
        }
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
      navigate("/daftar-kuis");
      return;
    }
    fetchSoalData();
  }, [kuisId, navigate, fetchSoalData]);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      setError("");
      const soalData = {
        question: formData.question,
        options: formData.options,
        correct_answer: formData.correct_answer,
        kuis_id: kuisId
      };

      const response = await api.addSoal(soalData);

      if (response.success) {
        alert("Soal berhasil ditambahkan");
        resetForm();
        setShowAddForm(false);
        fetchSoalData();
      } else {
        throw new Error(response.message || "Gagal menambahkan soal");
      }
    } catch (err) {
      setError(err.message || "Terjadi kesalahan saat menambahkan soal");
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      const soalData = {
        question: formData.question,
        options: formData.options,
        correct_answer: formData.correct_answer,
        kuis_id: kuisId
      };

      const response = await api.updateSoal(editingItem.id, soalData);

      if (response.success) {
        alert("Soal berhasil diperbarui");
        resetForm();
        setEditingItem(null);
        setShowAddForm(false);
        fetchSoalData();
      } else {
        throw new Error(response.message || "Gagal memperbarui soal");
      }
    } catch (err) {
      setError(err.message || "Terjadi kesalahan saat memperbarui soal");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus soal ini?")) return;

    try {
      const response = await api.deleteSoal(id);
      if (response.success) {
        alert("Soal berhasil dihapus");
        fetchSoalData();
      } else {
        throw new Error(response.message || "Gagal menghapus soal");
      }
    } catch (err) {
      setError(err.message || "Terjadi kesalahan saat menghapus soal");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('option_')) {
      const optionKey = name.split('_')[1];
      setFormData(prev => ({
        ...prev,
        options: {
          ...prev.options,
          [optionKey]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const resetForm = () => {
    setFormData({
      question: "",
      options: {
        A: "",
        B: "",
        C: "",
        D: ""
      },
      correct_answer: ""
    });
  };

  const openAddForm = () => {
    resetForm();
    setEditingItem(null);
    setShowAddForm(true);
  };

  const openEditForm = (item) => {
    setFormData({
      question: item.question || "",
      options: item.parsedOptions || { A: "", B: "", C: "", D: "" },
      correct_answer: item.correct_answer || ""
    });
    setEditingItem(item);
    setShowAddForm(true);
  };

  const closeForm = () => {
    setShowAddForm(false);
    setEditingItem(null);
    resetForm();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className={`bg-gradient-to-r ${pageConfig.gradient} px-8 py-6`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <SoalIcon className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-white mb-1">Kelola Soal</h1>
                    <p className="text-white/80">
                      {kuisInfo ? kuisInfo.title : `Kuis ID: ${kuisId}`}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => navigate("/daftar-kuis")}
                    className="px-4 py-2 bg-white/10 backdrop-blur-sm text-white font-medium rounded-lg hover:bg-white/20 transition-all duration-200"
                  >
                    ← Kembali
                  </button>
                  <button
                    onClick={openAddForm}
                    className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-white/30 focus:outline-none focus:ring-4 focus:ring-white/30 transition-all duration-200 transform hover:scale-105 shadow-lg"
                  >
                    <span className="flex items-center space-x-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      <span>Tambah Soal</span>
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Stats Section */}
            <div className="bg-gray-50 px-8 py-4 border-t border-gray-100">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Total Soal: <span className="font-semibold text-gray-900">{soalList.length}</span></span>
                <span className="text-gray-600">Kuis ID: <span className="font-semibold text-emerald-600">{kuisId}</span></span>
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

        {/* Form */}
        {(showAddForm || editingItem) && (
          <div className="mb-8 animate-slide-up">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              {/* Form Header */}
              <div className={`bg-gradient-to-r ${pageConfig.gradient} px-6 py-4`}>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <SoalIcon className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-white">
                    {editingItem ? "Edit Soal" : "Tambah Soal Baru"}
                  </h2>
                </div>
              </div>

              {/* Form Content */}
              <div className="p-6">
                <form onSubmit={editingItem ? handleEdit : handleAdd} className="space-y-6">
                  {/* Question */}
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Pertanyaan *
                    </label>
                    <textarea
                      name="question"
                      value={formData.question}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-200 transition-all duration-200 resize-none"
                      rows="4"
                      placeholder="Masukkan pertanyaan soal..."
                      required
                    />
                  </div>

                  {/* Options */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Pilihan Jawaban</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {['A', 'B', 'C', 'D'].map((option) => (
                        <div key={option} className="group">
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Pilihan {option} *
                          </label>
                          <input
                            type="text"
                            name={`option_${option}`}
                            value={formData.options[option]}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-200 transition-all duration-200"
                            placeholder={`Masukkan pilihan ${option}...`}
                            required
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Correct Answer */}
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Jawaban Benar *
                    </label>
                    <select
                      name="correct_answer"
                      value={formData.correct_answer}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-200 transition-all duration-200"
                      required
                    >
                      <option value="">Pilih Jawaban Benar</option>
                      <option value="A">A - {formData.options.A || 'Pilihan A'}</option>
                      <option value="B">B - {formData.options.B || 'Pilihan B'}</option>
                      <option value="C">C - {formData.options.C || 'Pilihan C'}</option>
                      <option value="D">D - {formData.options.D || 'Pilihan D'}</option>
                    </select>
                  </div>

                  {/* Form Actions */}
                  <div className="flex justify-end space-x-4 pt-6 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={closeForm}
                      className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 focus:outline-none focus:ring-4 focus:ring-gray-300 transition-all duration-200 transform hover:scale-105"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className={`px-6 py-3 bg-gradient-to-r ${pageConfig.gradient} text-white font-semibold rounded-xl hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-emerald-300 transition-all duration-200 transform hover:scale-105`}
                    >
                      <span className="flex items-center space-x-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{editingItem ? "Update Soal" : "Simpan Soal"}</span>
                      </span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Data Grid */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
              <p className="text-gray-600">Memuat data soal...</p>
            </div>
          ) : soalList.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <SoalIcon className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Belum Ada Soal</h3>
              <p className="text-gray-500 mb-6">Mulai dengan menambahkan soal pertama untuk kuis ini</p>
              <button
                onClick={openAddForm}
                className={`px-6 py-3 bg-gradient-to-r ${pageConfig.gradient} text-white font-semibold rounded-xl hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-emerald-300 transition-all duration-200 transform hover:scale-105`}
              >
                <span className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Tambah Soal Pertama</span>
                </span>
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {soalList.map((item, index) => (
                <div
                  key={item.ID || item.id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-emerald-200 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Card Header */}
                  <div className={`bg-gradient-to-r ${pageConfig.gradient} p-4`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold">{index + 1}</span>
                        </div>
                        <div className="text-white font-semibold">
                          Soal #{index + 1}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openEditForm(item)}
                          className="px-3 py-1 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-all duration-200 text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item.ID || item.id)}
                          className="px-3 py-1 bg-red-500/20 text-white rounded-lg hover:bg-red-500/30 transition-all duration-200 text-sm"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6">
                    {/* Question */}
                    <div className="mb-6">
                      <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                        Pertanyaan
                      </div>
                      <div className="text-gray-900 font-medium leading-relaxed">
                        {item.question || item.Question || '-'}
                      </div>
                    </div>

                    {/* Options */}
                    <div className="mb-6">
                      <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                        Pilihan Jawaban
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {item.parsedOptions && Object.entries(item.parsedOptions).map(([key, value]) => (
                          <div
                            key={key}
                            className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                              item.correct_answer === key
                                ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                                : 'border-gray-200 bg-gray-50 text-gray-700'
                            }`}
                          >
                            <div className="flex items-center space-x-2">
                              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                item.correct_answer === key
                                  ? 'bg-emerald-500 text-white'
                                  : 'bg-gray-300 text-gray-600'
                              }`}>
                                {key}
                              </span>
                              <span className="text-sm">{value}</span>
                              {item.correct_answer === key && (
                                <svg className="w-4 h-4 text-emerald-500 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Correct Answer */}
                    <div>
                      <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                        Jawaban Benar
                      </div>
                      <div className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Pilihan {item.correct_answer}
                      </div>
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

export default BuatSoal;
