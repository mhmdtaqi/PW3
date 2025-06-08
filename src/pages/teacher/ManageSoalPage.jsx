import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { parseOptions, normalizeOptionsForForm } from '../../utils/optionsParser';

// Use the same BASE_URL logic as other components
const BASE_URL = import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? "http://localhost:8000" : "https://brainquiz0.up.railway.app");

const ManageSoalPage = () => {
  const { kuisId } = useParams();
  const navigate = useNavigate();
  const [kuis, setKuis] = useState(null);
  const [soalList, setSoalList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [selectedSoal, setSelectedSoal] = useState(null);
  const [formData, setFormData] = useState({
    question: '',
    options: ['', '', '', ''],
    correct_answer: ''
  });

  useEffect(() => {
    fetchKuisDetail();
    fetchSoal();
  }, [kuisId]);

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

  const handleAddSoal = () => {
    setModalMode('add');
    setFormData({
      question: '',
      options: ['', '', '', ''],
      correct_answer: ''
    });
    setShowModal(true);
  };

  const handleEditSoal = (soal) => {
    setModalMode('edit');
    setSelectedSoal(soal);

    // Parse options using utility function
    const normalizedOptions = normalizeOptionsForForm(soal.options_json || soal.Options);

    setFormData({
      question: soal.question || '',
      options: normalizedOptions,
      correct_answer: soal.correct_answer || ''
    });
    setShowModal(true);
  };

  const handleDeleteSoal = async (soalId) => {
    if (!confirm('Apakah Anda yakin ingin menghapus soal ini?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}/soal/delete-soal/${soalId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        alert('Soal berhasil dihapus!');
        fetchSoal();
      } else {
        const data = await response.json();
        alert(data.message || 'Gagal menghapus soal');
      }
    } catch (error) {
      console.error('Error deleting soal:', error);
      alert('Terjadi kesalahan saat menghapus soal');
    }
  };

  const handleSubmitSoal = async (e) => {
    e.preventDefault();
    
    // Validate that options is an array
    if (!Array.isArray(formData.options)) {
      alert('Error: Format pilihan jawaban tidak valid');
      return;
    }

    // Validate that all options are filled
    if (formData.options.some(option => !option.trim())) {
      alert('Semua pilihan jawaban harus diisi');
      return;
    }

    // Validate that correct answer is one of the options
    if (!formData.options.includes(formData.correct_answer)) {
      alert('Jawaban benar harus salah satu dari pilihan jawaban');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const url = modalMode === 'add' 
        ? `${BASE_URL}/soal/add-soal`
        : `${BASE_URL}/soal/update-soal/${selectedSoal.ID}`;
      
      const method = modalMode === 'add' ? 'POST' : 'PATCH';

      const requestData = {
        question: formData.question,
        options_json: JSON.stringify(formData.options),  // Use correct field name
        correct_answer: formData.correct_answer,
        kuis_id: parseInt(kuisId)
      };

      console.log('Submitting soal:', requestData);

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        alert(`Soal berhasil ${modalMode === 'add' ? 'ditambahkan' : 'diupdate'}!`);
        setShowModal(false);
        fetchSoal();
      } else {
        const data = await response.json();
        alert(data.message || `Gagal ${modalMode === 'add' ? 'menambahkan' : 'mengupdate'} soal`);
      }
    } catch (error) {
      console.error('Error submitting soal:', error);
      alert('Terjadi kesalahan saat menyimpan soal');
    }
  };

  const updateOption = (index, value) => {
    if (!Array.isArray(formData.options)) {
      console.error('formData.options is not an array:', formData.options);
      return;
    }
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({...formData, options: newOptions});
  };

  // parseOptions function moved to utils/optionsParser.js

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Memuat data soal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-8">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <div className="flex items-center space-x-4 mb-6">
          <button
            onClick={() => navigate('/daftar-kuis')}
            className="w-10 h-10 bg-white/60 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex-1">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
              Kelola Soal
            </h1>
            {kuis && (
              <p className="text-xl text-slate-600 font-medium">
                Kuis: {kuis.title}
              </p>
            )}
          </div>
          <button
            onClick={handleAddSoal}
            className="btn-primary flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Tambah Soal</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-scale-in">
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-600">Total Soal</p>
              <p className="text-2xl font-bold text-slate-800">{soalList.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-600">Kuis</p>
              <p className="text-2xl font-bold text-slate-800">{kuis?.title || 'Loading...'}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-600">Kategori</p>
              <p className="text-2xl font-bold text-slate-800">{kuis?.Kategori?.name || '-'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Soal List */}
      <div className="space-y-6 animate-bounce-in">
        {soalList.map((soal, index) => {
          const options = parseOptions(soal.options_json || soal.Options);
          
          return (
            <div
              key={soal.ID}
              className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-800 mb-4">{soal.question}</h3>
                    
                    <div className="space-y-2 mb-4">
                      {Array.isArray(options) && options.length > 0 ? options.map((option, optIndex) => (
                        <div
                          key={optIndex}
                          className={`flex items-center p-3 rounded-xl border-2 ${
                            option === soal.correct_answer
                              ? 'border-green-500 bg-green-50'
                              : 'border-slate-200 bg-slate-50'
                          }`}
                        >
                          <span className="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                            {String.fromCharCode(65 + optIndex)}
                          </span>
                          <span className="text-slate-700">{option}</span>
                          {option === soal.correct_answer && (
                            <svg className="w-5 h-5 text-green-500 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          )}
                        </div>
                      )) : (
                        <div className="text-slate-500 text-sm">Tidak ada pilihan jawaban</div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => handleEditSoal(soal)}
                    className="w-10 h-10 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-xl flex items-center justify-center transition-colors duration-200"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDeleteSoal(soal.ID)}
                    className="w-10 h-10 bg-red-100 hover:bg-red-200 text-red-600 rounded-xl flex items-center justify-center transition-colors duration-200"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {soalList.length === 0 && (
        <div className="text-center py-16 animate-fade-in">
          <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Belum ada soal</h3>
          <p className="text-slate-600 mb-6">
            Mulai tambahkan soal untuk kuis ini.
          </p>
          <button
            onClick={handleAddSoal}
            className="btn-primary"
          >
            Tambah Soal Pertama
          </button>
        </div>
      )}

      {/* Modal Add/Edit Soal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-800">
                {modalMode === 'add' ? 'Tambah Soal Baru' : 'Edit Soal'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center justify-center transition-colors duration-200"
              >
                <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmitSoal} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Pertanyaan</label>
                <textarea
                  value={formData.question}
                  onChange={(e) => setFormData({...formData, question: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Masukkan pertanyaan soal"
                  rows="3"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-4">Pilihan Jawaban</label>
                <div className="space-y-3">
                  {Array.isArray(formData.options) ? formData.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <span className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-sm font-semibold">
                        {String.fromCharCode(65 + index)}
                      </span>
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => updateOption(index, e.target.value)}
                        className="flex-1 px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder={`Pilihan ${String.fromCharCode(65 + index)}`}
                        required
                      />
                    </div>
                  )) : (
                    <div className="text-red-500 text-sm">Error: Options tidak valid</div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Jawaban Benar</label>
                <select
                  value={formData.correct_answer}
                  onChange={(e) => setFormData({...formData, correct_answer: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                >
                  <option value="">Pilih jawaban yang benar</option>
                  {Array.isArray(formData.options) ? formData.options.map((option, index) => (
                    option.trim() && (
                      <option key={index} value={option}>
                        {String.fromCharCode(65 + index)}. {option}
                      </option>
                    )
                  )) : null}
                </select>
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 btn-outline"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary"
                >
                  {modalMode === 'add' ? 'Tambah Soal' : 'Update Soal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageSoalPage;
