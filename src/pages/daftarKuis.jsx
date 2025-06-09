import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

// Icon component for Kuis
const KuisIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const DaftarKuis = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);

  // Dropdown data states
  const [tingkatanList, setTingkatanList] = useState([]);
  const [kategoriList, setKategoriList] = useState([]);
  const [pendidikanList, setPendidikanList] = useState([]);
  const [kelasList, setKelasList] = useState([]);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tingkatan_id: "",
    kategori_id: "",
    pendidikan_id: "",
    kelas_id: ""
  });

  // Page configuration
  const pageConfig = {
    icon: KuisIcon,
    gradient: "from-purple-500 to-pink-600",
    description: "Kelola kuis pembelajaran dengan berbagai kategori dan tingkatan",
    stats: true
  };

  const fetchKuisData = useCallback(async () => {
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
          setData(responseData.data);
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

  const fetchDropdownData = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const [tingkatanRes, kategoriRes, pendidikanRes, kelasRes] = await Promise.all([
        fetch("https://brainquiz0.up.railway.app/tingkatan/get-tingkatan", { headers }),
        fetch("https://brainquiz0.up.railway.app/kategori/get-kategori", { headers }),
        fetch("https://brainquiz0.up.railway.app/pendidikan/get-pendidikan", { headers }),
        fetch("https://brainquiz0.up.railway.app/kelas/get-kelas", { headers })
      ]);

      const [tingkatanData, kategoriData, pendidikanData, kelasData] = await Promise.all([
        tingkatanRes.json(),
        kategoriRes.json(),
        pendidikanRes.json(),
        kelasRes.json()
      ]);

      if (tingkatanData.success) setTingkatanList(tingkatanData.data);
      if (kategoriData.success) setKategoriList(kategoriData.data);
      if (pendidikanData.success) setPendidikanList(pendidikanData.data);
      if (kelasData.success) setKelasList(kelasData.data);
    } catch (err) {
      console.error("Error fetching dropdown data:", err);
    }
  };

  // Fetch all data on component mount
  useEffect(() => {
    fetchKuisData();
    fetchDropdownData();
  }, [fetchKuisData]);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      setError("");
      const response = await api.addKuis(formData);

      if (response.success) {
        alert("Kuis berhasil ditambahkan");
        setFormData({
          title: "",
          description: "",
          tingkatan_id: "",
          kategori_id: "",
          pendidikan_id: "",
          kelas_id: ""
        });
        setShowAddForm(false);
        fetchKuisData();
      } else {
        throw new Error(response.message || "Gagal menambahkan kuis");
      }
    } catch (err) {
      setError(err.message || "Terjadi kesalahan saat menambahkan kuis");
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      console.log("Editing kuis with ID:", editingItem.id);
      console.log("Form data being sent:", formData);

      const response = await api.updateKuis(editingItem.id, formData);

      if (response.success) {
        alert("Kuis berhasil diperbarui");
        setEditingItem(null);
        setShowAddForm(false);
        fetchKuisData();
      } else {
        throw new Error(response.message || "Gagal memperbarui kuis");
      }
    } catch (err) {
      console.error("Error in handleEdit:", err);
      setError(err.message || "Terjadi kesalahan saat memperbarui kuis");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus kuis ini?")) return;

    try {
      const response = await api.deleteKuis(id);
      if (response.success) {
        alert("Kuis berhasil dihapus");
        fetchKuisData();
      } else {
        throw new Error(response.message || "Gagal menghapus kuis");
      }
    } catch (err) {
      setError(err.message || "Terjadi kesalahan saat menghapus kuis");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const openAddForm = () => {
    setFormData({
      title: "",
      description: "",
      tingkatan_id: "",
      kategori_id: "",
      pendidikan_id: "",
      kelas_id: ""
    });
    setEditingItem(null);
    setShowAddForm(true);
  };

  const openEditForm = (item) => {
    console.log("Opening edit form for item:", item);
    setFormData({
      title: item.title || item.Title || "",
      description: item.description || item.Description || "",
      tingkatan_id: item.tingkatan_id || item.Tingkatan_id || "",
      kategori_id: item.kategori_id || item.Kategori_id || "",
      pendidikan_id: item.pendidikan_id || item.Pendidikan_id || "",
      kelas_id: item.kelas_id || item.Kelas_id || ""
    });
    setEditingItem({ ...item, id: item.ID || item.id });
    setShowAddForm(true);
  };

  const closeForm = () => {
    setShowAddForm(false);
    setEditingItem(null);
    setFormData({
      title: "",
      description: "",
      tingkatan_id: "",
      kategori_id: "",
      pendidikan_id: "",
      kelas_id: ""
    });
  };

  const navigateToSoal = (kuisId) => {
    navigate(`/kuis/${kuisId}/soal`);
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
                    <KuisIcon className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-white mb-1">Daftar Kuis</h1>
                    <p className="text-white/80">{pageConfig.description}</p>
                  </div>
                </div>
                <button
                  onClick={openAddForm}
                  className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-white/30 focus:outline-none focus:ring-4 focus:ring-white/30 transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  <span className="flex items-center space-x-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>Tambah Kuis</span>
                  </span>
                </button>
              </div>
            </div>

            {/* Stats Section */}
            <div className="bg-gray-50 px-8 py-4 border-t border-gray-100">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Total Kuis: <span className="font-semibold text-gray-900">{data.length}</span></span>
                <span className="text-gray-600">Status: <span className="font-semibold text-green-600">Aktif</span></span>
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
                    <KuisIcon className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-white">
                    {editingItem ? "Edit Kuis" : "Tambah Kuis Baru"}
                  </h2>
                </div>
              </div>

              {/* Form Content */}
              <div className="p-6">
                <form onSubmit={editingItem ? handleEdit : handleAdd} className="space-y-6">
                  {/* Title */}
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Judul Kuis *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-200 transition-all duration-200 transform focus:scale-[1.02]"
                      placeholder="Masukkan judul kuis..."
                      required
                    />
                  </div>

                  {/* Description */}
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Deskripsi *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-200 transition-all duration-200 resize-none"
                      rows="4"
                      placeholder="Masukkan deskripsi kuis..."
                      required
                    />
                  </div>

                  {/* Dropdown Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Tingkatan Dropdown */}
                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Tingkatan *
                      </label>
                      <select
                        name="tingkatan_id"
                        value={formData.tingkatan_id}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-200 transition-all duration-200"
                        required
                      >
                        <option value="">Pilih Tingkatan</option>
                        {tingkatanList.map((item) => (
                          <option key={item.ID || item.id} value={item.ID || item.id}>
                            {item.Name || item.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Kategori Dropdown */}
                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Kategori *
                      </label>
                      <select
                        name="kategori_id"
                        value={formData.kategori_id}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200 transition-all duration-200"
                        required
                      >
                        <option value="">Pilih Kategori</option>
                        {kategoriList.map((item) => (
                          <option key={item.ID || item.id} value={item.ID || item.id}>
                            {item.Name || item.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Pendidikan Dropdown */}
                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Pendidikan *
                      </label>
                      <select
                        name="pendidikan_id"
                        value={formData.pendidikan_id}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-200 transition-all duration-200"
                        required
                      >
                        <option value="">Pilih Pendidikan</option>
                        {pendidikanList.map((item) => (
                          <option key={item.ID || item.id} value={item.ID || item.id}>
                            {item.Name || item.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Kelas Dropdown */}
                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Kelas *
                      </label>
                      <select
                        name="kelas_id"
                        value={formData.kelas_id}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-200 transition-all duration-200"
                        required
                      >
                        <option value="">Pilih Kelas</option>
                        {kelasList.map((item) => (
                          <option key={item.ID || item.id} value={item.ID || item.id}>
                            {item.Name || item.name}
                          </option>
                        ))}
                      </select>
                    </div>
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
                      className={`px-6 py-3 bg-gradient-to-r ${pageConfig.gradient} text-white font-semibold rounded-xl hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-purple-300 transition-all duration-200 transform hover:scale-105`}
                    >
                      <span className="flex items-center space-x-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{editingItem ? "Update Kuis" : "Simpan Kuis"}</span>
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
              <div className="w-16 h-16 mx-auto mb-4 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
              <p className="text-gray-600">Memuat data kuis...</p>
            </div>
          ) : data.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <KuisIcon className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Belum Ada Kuis</h3>
              <p className="text-gray-500 mb-6">Mulai dengan menambahkan kuis pertama Anda</p>
              <button
                onClick={openAddForm}
                className={`px-6 py-3 bg-gradient-to-r ${pageConfig.gradient} text-white font-semibold rounded-xl hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-purple-300 transition-all duration-200 transform hover:scale-105`}
              >
                <span className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Tambah Kuis Pertama</span>
                </span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.map((item, index) => (
                <div
                  key={item.ID || item.id}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-purple-200 transform hover:-translate-y-2 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Card Header */}
                  <div className={`bg-gradient-to-r ${pageConfig.gradient} p-4`}>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                        <KuisIcon className="w-4 h-4 text-white" />
                      </div>
                      <div className="text-white font-semibold truncate">
                        {item.Title || item.title || 'Kuis'}
                      </div>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6">
                    <div className="space-y-4">
                      <div>
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                          Judul
                        </div>
                        <div className="text-gray-900 font-medium group-hover:text-purple-600 transition-colors duration-200">
                          {item.Title || item.title || '-'}
                        </div>
                      </div>

                      <div>
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                          Deskripsi
                        </div>
                        <div className="text-gray-900 font-medium">
                          <p className="text-sm leading-relaxed line-clamp-3">
                            {item.Description || item.description || '-'}
                          </p>
                        </div>
                      </div>

                      {/* Additional Info */}
                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Tingkatan</div>
                          <div className="text-sm font-medium text-green-600">
                            {item.tingkatan_name || 'N/A'}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Kategori</div>
                          <div className="text-sm font-medium text-blue-600">
                            {item.kategori_name || 'N/A'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-t border-gray-100">
                    <button
                      onClick={() => navigateToSoal(item.ID || item.id)}
                      className="px-4 py-2 rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-100 transition-all duration-200 font-medium transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-300"
                    >
                      <span className="flex items-center space-x-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        <span>Buat Soal</span>
                      </span>
                    </button>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => openEditForm(item)}
                        className="px-4 py-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all duration-200 font-medium transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-300"
                      >
                        <span className="flex items-center space-x-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          <span>Edit</span>
                        </span>
                      </button>
                      <button
                        onClick={() => handleDelete(item.ID || item.id)}
                        className="px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-all duration-200 font-medium transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-300"
                      >
                        <span className="flex items-center space-x-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          <span>Hapus</span>
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

export default DaftarKuis;
