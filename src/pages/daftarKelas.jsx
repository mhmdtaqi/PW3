import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const DaftarKelas = () => {
  const [kelas, setKelas] = useState([
    {
      id: 1,
      name: "Kelas Matematika Dasar",
      description: "Kelas untuk belajar matematika dasar",
      pendidikan_id: 1,
      kategori_id: 1,
      tingkatan_id: 1,
    },
    {
      id: 2,
      name: "Kelas Bahasa Inggris Lanjutan",
      description: "Kelas untuk belajar bahasa Inggris tingkat lanjut",
      pendidikan_id: 3,
      kategori_id: 3,
      tingkatan_id: 3,
    },
    {
      id: 3,
      name: "Kelas IPA SMP",
      description: "Kelas untuk belajar IPA tingkat SMP",
      pendidikan_id: 2,
      kategori_id: 4,
      tingkatan_id: 2,
    },
  ]);
  const [error, setError] = useState("");
  const [editingKelas, setEditingKelas] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newKelas, setNewKelas] = useState({
    name: "",
    description: "",
    pendidikan_id: "",
    kategori_id: "",
    tingkatan_id: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Fungsi untuk delay
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // Fetch kelas dengan retry
  const fetchKelas = async (retryCount = 0) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const authToken = `Bearer ${token}`;
      console.log("Token yang dikirim:", authToken);

      const response = await fetch(
        "https://brainquiz0.up.railway.app/kelas/get-kelas",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: authToken,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        if (data.success && data.data) {
          setKelas(data.data);
          setIsLoading(false);
        } else {
          setError(data.message || "Format data tidak valid");
          setIsLoading(false);
        }
      } else {
        if (response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          navigate("/login");
        } else {
          if (retryCount < 3) {
            await delay(30000);
            return fetchKelas(retryCount + 1);
          } else {
            setError("Gagal mengambil data kelas setelah beberapa percobaan");
            setIsLoading(false);
          }
        }
      }
    } catch (err) {
      if (retryCount < 3) {
        await delay(30000);
        return fetchKelas(retryCount + 1);
      } else {
        setError("Terjadi kesalahan saat mengambil data");
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    // fetchKelas(); // Dikomentari untuk sementara karena menggunakan data dummy
  }, []);

  // Add kelas
  const handleAdd = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const kelasData = {
        name: newKelas.name,
        description: newKelas.description,
        pendidikan_id: parseInt(newKelas.pendidikan_id),
        kategori_id: parseInt(newKelas.kategori_id),
        tingkatan_id: parseInt(newKelas.tingkatan_id),
      };

      const response = await fetch(
        "https://brainquiz0.up.railway.app/kelas/add-kelas",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(kelasData),
        }
      );
      const data = await response.json();

      if (response.ok) {
        alert("Kelas berhasil ditambahkan");
        setNewKelas({
          name: "",
          description: "",
          pendidikan_id: "",
          kategori_id: "",
          tingkatan_id: "",
        });
        setShowAddForm(false);
        fetchKelas();
      } else {
        setError(data.message || "Gagal menambahkan kelas");
      }
    } catch (err) {
      setError("Terjadi kesalahan saat menambahkan kelas");
    }
  };

  // Delete kelas
  const handleDelete = async (id) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus kelas ini?")) return;

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(
        `https://brainquiz0.up.railway.app/kelas/delete-kelas/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();

      if (response.ok) {
        alert("Kelas berhasil dihapus");
        fetchKelas();
      } else {
        setError(data.message || "Gagal menghapus kelas");
      }
    } catch (err) {
      setError("Terjadi kesalahan saat menghapus kelas");
    }
  };

  // Update kelas
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const updateData = {
        name: editingKelas.name,
        description: editingKelas.description,
        pendidikan_id: parseInt(editingKelas.pendidikan_id),
        kategori_id: parseInt(editingKelas.kategori_id),
        tingkatan_id: parseInt(editingKelas.tingkatan_id),
      };

      const response = await fetch(
        `https://brainquiz0.up.railway.app/kelas/update-kelas/${editingKelas.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updateData),
        }
      );
      const data = await response.json();

      if (response.ok) {
        alert("Kelas berhasil diperbarui");
        setEditingKelas(null);
        fetchKelas();
      } else {
        setError(data.message || "Gagal memperbarui kelas");
      }
    } catch (err) {
      setError("Terjadi kesalahan saat memperbarui kelas");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Daftar Kelas</h2>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {showAddForm ? "Batal" : "Tambah Kelas"}
              </button>
            </div>

            {error && (
              <div
                className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                role="alert"
              >
                <span className="block sm:inline">{error}</span>
              </div>
            )}

            {isLoading && (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="ml-3 text-gray-600">Memuat data kelas...</p>
              </div>
            )}

            {!isLoading && (
              <>
                {showAddForm && (
                  <div className="bg-gray-50 p-6 rounded-lg mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Tambah Kelas Baru
                    </h3>
                    <form onSubmit={handleAdd} className="space-y-4">
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Nama Kelas
                        </label>
                        <input
                          type="text"
                          id="name"
                          value={newKelas.name}
                          onChange={(e) =>
                            setNewKelas({
                              ...newKelas,
                              name: e.target.value,
                            })
                          }
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          required
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="description"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Deskripsi
                        </label>
                        <input
                          type="text"
                          id="description"
                          value={newKelas.description}
                          onChange={(e) =>
                            setNewKelas({
                              ...newKelas,
                              description: e.target.value,
                            })
                          }
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          required
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="pendidikan_id"
                          className="block text-sm font-medium text-gray-700"
                        >
                          ID Pendidikan
                        </label>
                        <input
                          type="number"
                          id="pendidikan_id"
                          value={newKelas.pendidikan_id}
                          onChange={(e) =>
                            setNewKelas({
                              ...newKelas,
                              pendidikan_id: e.target.value,
                            })
                          }
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          required
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="kategori_id"
                          className="block text-sm font-medium text-gray-700"
                        >
                          ID Kategori
                        </label>
                        <input
                          type="number"
                          id="kategori_id"
                          value={newKelas.kategori_id}
                          onChange={(e) =>
                            setNewKelas({
                              ...newKelas,
                              kategori_id: e.target.value,
                            })
                          }
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          required
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="tingkatan_id"
                          className="block text-sm font-medium text-gray-700"
                        >
                          ID Tingkatan
                        </label>
                        <input
                          type="number"
                          id="tingkatan_id"
                          value={newKelas.tingkatan_id}
                          onChange={(e) =>
                            setNewKelas({
                              ...newKelas,
                              tingkatan_id: e.target.value,
                            })
                          }
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Tambah Kelas
                      </button>
                    </form>
                  </div>
                )}

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Nama
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Deskripsi
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          ID Pendidikan
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          ID Kategori
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          ID Tingkatan
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Aksi
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {kelas && kelas.length > 0 ? (
                        kelas.map((item) => (
                          <tr key={item.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              {editingKelas?.id === item.id ? (
                                <input
                                  type="text"
                                  value={editingKelas.name}
                                  onChange={(e) =>
                                    setEditingKelas({
                                      ...editingKelas,
                                      name: e.target.value,
                                    })
                                  }
                                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                />
                              ) : (
                                <div className="text-sm text-gray-900">
                                  {item.name}
                                </div>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {editingKelas?.id === item.id ? (
                                <input
                                  type="text"
                                  value={editingKelas.description}
                                  onChange={(e) =>
                                    setEditingKelas({
                                      ...editingKelas,
                                      description: e.target.value,
                                    })
                                  }
                                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                />
                              ) : (
                                <div className="text-sm text-gray-900">
                                  {item.description}
                                </div>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {editingKelas?.id === item.id ? (
                                <input
                                  type="number"
                                  value={editingKelas.pendidikan_id}
                                  onChange={(e) =>
                                    setEditingKelas({
                                      ...editingKelas,
                                      pendidikan_id: e.target.value,
                                    })
                                  }
                                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                />
                              ) : (
                                <div className="text-sm text-gray-900">
                                  {item.pendidikan_id}
                                </div>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {editingKelas?.id === item.id ? (
                                <input
                                  type="number"
                                  value={editingKelas.kategori_id}
                                  onChange={(e) =>
                                    setEditingKelas({
                                      ...editingKelas,
                                      kategori_id: e.target.value,
                                    })
                                  }
                                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                />
                              ) : (
                                <div className="text-sm text-gray-900">
                                  {item.kategori_id}
                                </div>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {editingKelas?.id === item.id ? (
                                <input
                                  type="number"
                                  value={editingKelas.tingkatan_id}
                                  onChange={(e) =>
                                    setEditingKelas({
                                      ...editingKelas,
                                      tingkatan_id: e.target.value,
                                    })
                                  }
                                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                />
                              ) : (
                                <div className="text-sm text-gray-900">
                                  {item.tingkatan_id}
                                </div>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              {editingKelas?.id === item.id ? (
                                <div className="flex space-x-3">
                                  <button
                                    onClick={handleUpdate}
                                    className="text-green-600 hover:text-green-900"
                                  >
                                    Simpan
                                  </button>
                                  <button
                                    onClick={() => setEditingKelas(null)}
                                    className="text-gray-600 hover:text-gray-900"
                                  >
                                    Batal
                                  </button>
                                </div>
                              ) : (
                                <div className="flex space-x-3">
                                  <button
                                    onClick={() => setEditingKelas(item)}
                                    className="text-blue-600 hover:text-blue-900"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => handleDelete(item.id)}
                                    className="text-red-600 hover:text-red-900"
                                  >
                                    Hapus
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="6"
                            className="px-6 py-4 text-center text-sm text-gray-500"
                          >
                            Tidak ada data kelas
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DaftarKelas;
