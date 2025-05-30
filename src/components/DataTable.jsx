import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const DataTable = ({
  title,
  endpoint,
  fields,
  onAdd,
  onEdit,
  onDelete,
  transformData = (data) => data,
  pageConfig = {},
}) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState(
    fields.reduce((acc, field) => ({ ...acc, [field.name]: "" }), {})
  );
  const [_isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const fetchData = useCallback(async (retryCount = 0) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      console.log("Fetching data from:", endpoint);
      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);

      // Cek content type
      const contentType = response.headers.get("content-type");
      console.log("Content-Type:", contentType);

      if (!contentType || !contentType.includes("application/json")) {
        console.error("Invalid content type:", contentType);
        if (response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          navigate("/login");
          throw new Error("Sesi Anda telah berakhir. Silakan login kembali.");
        }
        throw new Error("Terjadi kesalahan pada server");
      }

      const responseData = await response.json();
      console.log("Data yang diterima:", responseData);

      if (response.ok) {
        if (responseData.success && responseData.data) {
          const transformedData = transformData(responseData.data);
          console.log("Data setelah transformasi:", transformedData);
          setData(transformedData);
          setError("");
        } else {
          console.error("Format data tidak valid:", responseData);
          setError(
            "Format data tidak valid: " +
              (responseData.message || "Tidak ada pesan error")
          );
        }
      } else {
        if (response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          navigate("/login");
        } else {
          if (retryCount < 3) {
            console.log(`Retry attempt ${retryCount + 1} of 3`);
            await delay(1000); // Tunggu 1 detik sebelum retry
            return fetchData(retryCount + 1);
          } else {
            setError(
              responseData.message ||
                "Gagal mengambil data setelah beberapa percobaan"
            );
          }
        }
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      if (retryCount < 3) {
        console.log(`Retry attempt ${retryCount + 1} of 3`);
        await delay(1000); // Tunggu 1 detik sebelum retry
        return fetchData(retryCount + 1);
      } else {
        setError(err.message || "Terjadi kesalahan saat mengambil data");
      }
    } finally {
      setIsLoading(false);
    }
  }, [endpoint, navigate, transformData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAdd = async (e) => {
    e.preventDefault();
    setError("");
    try {
      console.log("Data yang akan ditambahkan:", newItem);
      const success = await onAdd(newItem);
      if (success) {
        setNewItem(
          fields.reduce((acc, field) => ({ ...acc, [field.name]: "" }), {})
        );
        setShowAddForm(false);
        await fetchData();
      }
    } catch (err) {
      console.error("Error adding data:", err);
      setError(err.message || "Terjadi kesalahan saat menambahkan data");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      if (!editingItem || !editingItem.id) {
        throw new Error("ID tidak ditemukan");
      }
      console.log("Data yang akan diupdate:", editingItem);
      const success = await onEdit(editingItem.id, editingItem);
      if (success) {
        setEditingItem(null);
        setShowAddForm(false);
        await fetchData();
      }
    } catch (err) {
      console.error("Error updating data:", err);
      setError(err.message || "Terjadi kesalahan saat memperbarui data");
    }
  };

  const handleDelete = async (id) => {
    if (!id) {
      setError("ID tidak ditemukan");
      return;
    }
    if (!window.confirm("Apakah Anda yakin ingin menghapus data ini?")) return;
    try {
      console.log("ID yang akan dihapus:", id);
      const success = await onDelete(id);
      if (success) {
        await fetchData();
      }
    } catch (err) {
      console.error("Error deleting data:", err);
      setError(err.message || "Terjadi kesalahan saat menghapus data");
    }
  };

  const renderForm = () => {
    if (!showAddForm && !editingItem) return null;

    const { icon: PageIcon, gradient = "from-blue-500 to-purple-600" } = pageConfig;

    return (
      <div className="mb-8 animate-slide-up">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Form Header */}
          <div className={`bg-gradient-to-r ${gradient} px-6 py-4`}>
            <div className="flex items-center space-x-3">
              {PageIcon && (
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <PageIcon className="w-5 h-5 text-white" />
                </div>
              )}
              <h2 className="text-xl font-bold text-white">
                {editingItem ? "Edit Data" : "Tambah Data Baru"}
              </h2>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-6">
            <form onSubmit={editingItem ? handleUpdate : handleAdd} className="space-y-6">
              {fields.map((field, index) => (
                <div key={`${field.name}-${index}`} className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-blue-600 transition-colors duration-200">
                    {field.label}
                  </label>
                  {field.type === "textarea" ? (
                    <textarea
                      name={field.name}
                      value={
                        editingItem ? editingItem[field.name] : newItem[field.name]
                      }
                      onChange={(e) =>
                        editingItem
                          ? setEditingItem({
                              ...editingItem,
                              [field.name]: e.target.value,
                            })
                          : setNewItem({ ...newItem, [field.name]: e.target.value })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200 transition-all duration-200 resize-none"
                      rows="4"
                      placeholder={`Masukkan ${field.label.toLowerCase()}...`}
                      required={field.required}
                    />
                  ) : (
                    <input
                      type={field.type || "text"}
                      name={field.name}
                      value={
                        editingItem ? editingItem[field.name] : newItem[field.name]
                      }
                      onChange={(e) =>
                        editingItem
                          ? setEditingItem({
                              ...editingItem,
                              [field.name]: e.target.value,
                            })
                          : setNewItem({ ...newItem, [field.name]: e.target.value })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200 transition-all duration-200 transform focus:scale-[1.02]"
                      placeholder={`Masukkan ${field.label.toLowerCase()}...`}
                      required={field.required}
                    />
                  )}
                </div>
              ))}

              {/* Form Actions */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    setEditingItem(null);
                    setShowAddForm(false);
                    setNewItem(
                      fields.reduce(
                        (acc, field) => ({ ...acc, [field.name]: "" }),
                        {}
                      )
                    );
                  }}
                  className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 focus:outline-none focus:ring-4 focus:ring-gray-300 transition-all duration-200 transform hover:scale-105"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className={`px-6 py-3 bg-gradient-to-r ${gradient} text-white font-semibold rounded-xl hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-200 transform hover:scale-105`}
                >
                  <span className="flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{editingItem ? "Update Data" : "Simpan Data"}</span>
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  const {
    icon: PageIcon,
    gradient = "from-blue-500 to-purple-600",
    description = "Kelola data dengan mudah dan efisien",
    stats
  } = pageConfig;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className={`bg-gradient-to-r ${gradient} px-8 py-6`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {PageIcon && (
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <PageIcon className="w-7 h-7 text-white" />
                    </div>
                  )}
                  <div>
                    <h1 className="text-3xl font-bold text-white mb-1">{title}</h1>
                    <p className="text-white/80">{description}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-white/30 focus:outline-none focus:ring-4 focus:ring-white/30 transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  <span className="flex items-center space-x-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>Tambah Data</span>
                  </span>
                </button>
              </div>
            </div>

            {/* Stats Section */}
            {stats && (
              <div className="bg-gray-50 px-8 py-4 border-t border-gray-100">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Total Data: <span className="font-semibold text-gray-900">{data.length}</span></span>
                  <span className="text-gray-600">Status: <span className="font-semibold text-green-600">Aktif</span></span>
                </div>
              </div>
            )}
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
        {renderForm()}

        {/* Data Grid */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          {data.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                {PageIcon ? (
                  <PageIcon className="w-12 h-12 text-gray-400" />
                ) : (
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                )}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Belum Ada Data</h3>
              <p className="text-gray-500 mb-6">Mulai dengan menambahkan data pertama Anda</p>
              <button
                onClick={() => setShowAddForm(true)}
                className={`px-6 py-3 bg-gradient-to-r ${gradient} text-white font-semibold rounded-xl hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-200 transform hover:scale-105`}
              >
                <span className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Tambah Data Pertama</span>
                </span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.map((item, index) => (
                <div
                  key={item.id}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200 transform hover:-translate-y-2 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => {
                    if (title === "Daftar Kelas") {
                      navigate(`/kelas/${item.id}`);
                    }
                  }}
                >
                  {/* Card Header */}
                  <div className={`bg-gradient-to-r ${gradient} p-4`}>
                    <div className="flex items-center space-x-3">
                      {PageIcon && (
                        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                          <PageIcon className="w-4 h-4 text-white" />
                        </div>
                      )}
                      <div className="text-white font-semibold truncate">
                        {item[fields[0]?.name] || 'Data'}
                      </div>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6">
                    {fields.map((field, fieldIndex) => (
                      <div key={field.name} className={`${fieldIndex > 0 ? 'mt-4' : ''}`}>
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                          {field.label}
                        </div>
                        <div className="text-gray-900 font-medium group-hover:text-blue-600 transition-colors duration-200">
                          {field.type === 'textarea' ? (
                            <p className="text-sm leading-relaxed line-clamp-3">
                              {item[field.name] || '-'}
                            </p>
                          ) : (
                            <p className="truncate">
                              {item[field.name] || '-'}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Card Actions */}
                  <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t border-gray-100">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingItem(item);
                      }}
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
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(item.id);
                      }}
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
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataTable;
