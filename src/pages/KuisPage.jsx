import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Use the same BASE_URL logic as other components
const BASE_URL = import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? "/api" : "https://brainquiz0.up.railway.app");

const KuisPage = () => {
  const [kuisList, setKuisList] = useState([]);
  const [filteredKuis, setFilteredKuis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedKategori, setSelectedKategori] = useState('');
  const [selectedTingkatan, setSelectedTingkatan] = useState('');
  const [selectedPendidikan, setSelectedPendidikan] = useState('');
  const [kategoris, setKategoris] = useState([]);
  const [tingkatans, setTingkatans] = useState([]);
  const [pendidikans, setPendidikans] = useState([]);
  const [kelasList, setKelasList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [selectedKuis, setSelectedKuis] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    kategori_id: '',
    tingkatan_id: '',
    kelas_id: '',
    pendidikan_id: ''
  });
  const navigate = useNavigate();

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
    fetchKuis();
    fetchFilterOptions();
    fetchKelas();
  }, []);

  useEffect(() => {
    filterKuis();
  }, [kuisList, searchTerm, selectedKategori, selectedTingkatan, selectedPendidikan]);

  const fetchKuis = async () => {
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
        setKuisList(data.data || []);
      } else {
        console.error('Failed to fetch kuis');
      }
    } catch (error) {
      console.error('Error fetching kuis:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFilterOptions = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch kategoris
      const kategoriResponse = await fetch(`${BASE_URL}/kategori/get-kategori`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      if (kategoriResponse.ok) {
        const kategoriData = await kategoriResponse.json();
        setKategoris(kategoriData.data || []);
      }

      // Fetch tingkatans
      const tingkatanResponse = await fetch(`${BASE_URL}/tingkatan/get-tingkatan`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      if (tingkatanResponse.ok) {
        const tingkatanData = await tingkatanResponse.json();
        setTingkatans(tingkatanData.data || []);
      }

      // Fetch pendidikans
      const pendidikanResponse = await fetch(`${BASE_URL}/pendidikan/get-pendidikan`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      if (pendidikanResponse.ok) {
        const pendidikanData = await pendidikanResponse.json();
        setPendidikans(pendidikanData.data || []);
      }
    } catch (error) {
      console.error('Error fetching filter options:', error);
    }
  };

  const fetchKelas = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}/kelas/get-kelas`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setKelasList(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching kelas:', error);
    }
  };

  const handleAddKuis = () => {
    setModalMode('add');
    setFormData({
      title: '',
      description: '',
      kategori_id: '',
      tingkatan_id: '',
      kelas_id: '',
      pendidikan_id: ''
    });
    setShowModal(true);
  };

  const handleEditKuis = (kuis) => {
    setModalMode('edit');
    setSelectedKuis(kuis);
    setFormData({
      title: kuis.title,
      description: kuis.description,
      kategori_id: kuis.kategori_id,
      tingkatan_id: kuis.tingkatan_id,
      kelas_id: kuis.kelas_id,
      pendidikan_id: kuis.pendidikan_id
    });
    setShowModal(true);
  };

  const handleDeleteKuis = async (kuisId) => {
    if (!confirm('Apakah Anda yakin ingin menghapus kuis ini?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}/kuis/delete-kuis/${kuisId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        alert('Kuis berhasil dihapus!');
        fetchKuis();
      } else {
        const data = await response.json();
        alert(data.message || 'Gagal menghapus kuis');
      }
    } catch (error) {
      console.error('Error deleting kuis:', error);
      alert('Terjadi kesalahan saat menghapus kuis');
    }
  };

  const handleSubmitKuis = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const url = modalMode === 'add'
        ? `${BASE_URL}/kuis/add-kuis`
        : `${BASE_URL}/kuis/update-kuis/${selectedKuis.ID}`;

      const method = modalMode === 'add' ? 'POST' : 'PATCH';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          kategori_id: parseInt(formData.kategori_id),
          tingkatan_id: parseInt(formData.tingkatan_id),
          kelas_id: parseInt(formData.kelas_id),
          pendidikan_id: parseInt(formData.pendidikan_id)
        }),
      });

      if (response.ok) {
        alert(`Kuis berhasil ${modalMode === 'add' ? 'ditambahkan' : 'diupdate'}!`);
        setShowModal(false);
        fetchKuis();
      } else {
        const data = await response.json();
        alert(data.message || `Gagal ${modalMode === 'add' ? 'menambahkan' : 'mengupdate'} kuis`);
      }
    } catch (error) {
      console.error('Error submitting kuis:', error);
      alert('Terjadi kesalahan saat menyimpan kuis');
    }
  };

  const handleManageSoal = (kuis) => {
    navigate(`/kuis/${kuis.ID}/manage-soal`);
  };

  const filterKuis = () => {
    let filtered = kuisList;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(kuis => 
        kuis.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        kuis.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by kategori
    if (selectedKategori) {
      filtered = filtered.filter(kuis => kuis.kategori_id === parseInt(selectedKategori));
    }

    // Filter by tingkatan
    if (selectedTingkatan) {
      filtered = filtered.filter(kuis => kuis.tingkatan_id === parseInt(selectedTingkatan));
    }

    // Filter by pendidikan
    if (selectedPendidikan) {
      filtered = filtered.filter(kuis => kuis.pendidikan_id === parseInt(selectedPendidikan));
    }

    setFilteredKuis(filtered);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedKategori('');
    setSelectedTingkatan('');
    setSelectedPendidikan('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Memuat data kuis...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-8">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
              Manage Kuis 📝
            </h1>
            <p className="text-xl text-slate-600 font-medium leading-relaxed max-w-3xl">
              Kelola kuis Anda dengan mudah. Tambah, edit, hapus kuis dan kelola soal-soalnya.
            </p>
          </div>

          <div className="mt-4 md:mt-0">
            <button
              onClick={handleAddKuis}
              className="btn-primary flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Tambah Kuis</span>
            </button>
          </div>
        </div>

        {/* Debug Info */}
        {userId && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
            <strong>User:</strong> {userName} (ID: {userId})
          </div>
        )}
      </div>

      {/* Search and Filters */}
      <div className="mb-8 animate-slide-up">
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search Input */}
            <div className="lg:col-span-2">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Cari kuis berdasarkan judul atau deskripsi..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                />
              </div>
            </div>

            {/* Kategori Filter */}
            <div>
              <select
                value={selectedKategori}
                onChange={(e) => setSelectedKategori(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
              >
                <option value="">Semua Kategori</option>
                {kategoris.map(kategori => (
                  <option key={kategori.ID} value={kategori.ID}>
                    {kategori.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Tingkatan Filter */}
            <div>
              <select
                value={selectedTingkatan}
                onChange={(e) => setSelectedTingkatan(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
              >
                <option value="">Semua Tingkatan</option>
                {tingkatans.map(tingkatan => (
                  <option key={tingkatan.ID} value={tingkatan.ID}>
                    {tingkatan.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Clear Filters Button */}
            <div>
              <button
                onClick={clearFilters}
                className="w-full px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition-all duration-200"
              >
                Reset Filter
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-scale-in">
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-600">Total Kuis</p>
              <p className="text-2xl font-bold text-slate-800">{kuisList.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-600">Hasil Filter</p>
              <p className="text-2xl font-bold text-slate-800">{filteredKuis.length}</p>
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
              <p className="text-2xl font-bold text-slate-800">{kategoris.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Kuis Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-bounce-in">
        {filteredKuis.map((kuis, index) => (
          <div
            key={kuis.ID}
            className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 animate-scale-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex flex-col h-full">
              {/* Kuis Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {kuis.Kategori && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                      {kuis.Kategori.name}
                    </span>
                  )}
                  {kuis.Tingkatan && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                      {kuis.Tingkatan.name}
                    </span>
                  )}
                </div>
              </div>

              {/* Kuis Info */}
              <h3 className="text-xl font-bold text-slate-800 mb-2">{kuis.title}</h3>
              <p className="text-slate-600 mb-4 flex-grow leading-relaxed">{kuis.description}</p>

              {/* Kuis Details */}
              <div className="mb-4 space-y-2">
                {kuis.Kelas && (
                  <div className="flex items-center text-sm text-slate-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    Kelas: {kuis.Kelas.name}
                  </div>
                )}
                {kuis.Pendidikan && (
                  <div className="flex items-center text-sm text-slate-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    {kuis.Pendidikan.name}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-auto space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleEditKuis(kuis)}
                    className="btn-outline text-sm py-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteKuis(kuis.ID)}
                    className="btn-danger text-sm py-2"
                  >
                    Hapus
                  </button>
                </div>
                <button
                  onClick={() => handleManageSoal(kuis)}
                  className="w-full btn-primary"
                >
                  Kelola Soal
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredKuis.length === 0 && (
        <div className="text-center py-16 animate-fade-in">
          <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Tidak ada kuis ditemukan</h3>
          <p className="text-slate-600 mb-6">
            Coba ubah filter atau kata kunci pencarian Anda.
          </p>
          <button
            onClick={clearFilters}
            className="btn-primary"
          >
            Reset Semua Filter
          </button>
        </div>
      )}

      {/* Modal Add/Edit Kuis */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-800">
                {modalMode === 'add' ? 'Tambah Kuis Baru' : 'Edit Kuis'}
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

            <form onSubmit={handleSubmitKuis} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Judul Kuis</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Masukkan judul kuis"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Deskripsi</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Masukkan deskripsi kuis"
                  rows="3"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Kategori</label>
                  <select
                    value={formData.kategori_id}
                    onChange={(e) => setFormData({...formData, kategori_id: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    required
                  >
                    <option value="">Pilih Kategori</option>
                    {kategoris.map(kategori => (
                      <option key={kategori.ID} value={kategori.ID}>
                        {kategori.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Tingkatan</label>
                  <select
                    value={formData.tingkatan_id}
                    onChange={(e) => setFormData({...formData, tingkatan_id: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    required
                  >
                    <option value="">Pilih Tingkatan</option>
                    {tingkatans.map(tingkatan => (
                      <option key={tingkatan.ID} value={tingkatan.ID}>
                        {tingkatan.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Kelas</label>
                  <select
                    value={formData.kelas_id}
                    onChange={(e) => setFormData({...formData, kelas_id: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    required
                  >
                    <option value="">Pilih Kelas</option>
                    {kelasList.map(kelas => (
                      <option key={kelas.ID} value={kelas.ID}>
                        {kelas.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Pendidikan</label>
                  <select
                    value={formData.pendidikan_id}
                    onChange={(e) => setFormData({...formData, pendidikan_id: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    required
                  >
                    <option value="">Pilih Pendidikan</option>
                    {pendidikans.map(pendidikan => (
                      <option key={pendidikan.ID} value={pendidikan.ID}>
                        {pendidikan.name}
                      </option>
                    ))}
                  </select>
                </div>
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
                  {modalMode === 'add' ? 'Tambah Kuis' : 'Update Kuis'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default KuisPage;
