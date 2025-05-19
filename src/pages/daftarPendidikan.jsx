import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const DaftarPendidikan = () => {
  const [pendidikan, setPendidikan] = useState([
    {
      id: 1,
      name: "SD",
      description: "Sekolah Dasar",
    },
    {
      id: 2,
      name: "SMP",
      description: "Sekolah Menengah Pertama",
    },
    {
      id: 3,
      name: "SMA",
      description: "Sekolah Menengah Atas",
    },
    {
      id: 4,
      name: "Kuliah",
      description: "Perguruan Tinggi",
    },
  ]);
  const [error, setError] = useState("");
  const [editingPendidikan, setEditingPendidikan] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPendidikan, setNewPendidikan] = useState({
    name: "",
    description: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Fungsi untuk delay
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // Fetch pendidikan dengan retry
  const fetchPendidikan = async (retryCount = 0) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const authToken = `Bearer ${token}`;
      console.log("Token yang dikirim:", authToken);

      const response = await fetch(
        "https://brainquiz0.up.railway.app/pendidikan/get-pendidikan",
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
          setPendidikan(data.data);
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
            return fetchPendidikan(retryCount + 1);
          } else {
            setError(
              "Gagal mengambil data pendidikan setelah beberapa percobaan"
            );
            setIsLoading(false);
          }
        }
      }
    } catch (err) {
      if (retryCount < 3) {
        await delay(30000);
        return fetchPendidikan(retryCount + 1);
      } else {
        setError("Terjadi kesalahan saat mengambil data");
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    // fetchPendidikan(); // Dikomentari untuk sementara karena menggunakan data dummy
  }, []);

  // Add pendidikan
  const handleAdd = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const pendidikanData = {
        name: newPendidikan.name,
        description: newPendidikan.description,
      };

      const response = await fetch(
        "https://brainquiz0.up.railway.app/pendidikan/add-pendidikan",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(pendidikanData),
        }
      );
      const data = await response.json();

      if (response.ok) {
        alert("Pendidikan berhasil ditambahkan");
        setNewPendidikan({ name: "", description: "" });
        setShowAddForm(false);
        fetchPendidikan();
      } else {
        setError(data.message || "Gagal menambahkan pendidikan");
      }
    } catch (err) {
      setError("Terjadi kesalahan saat menambahkan pendidikan");
    }
  };

  // Delete pendidikan
  const handleDelete = async (id) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus pendidikan ini?"))
      return;

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(
        `https://brainquiz0.up.railway.app/pendidikan/delete-pendidikan/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();

      if (response.ok) {
        alert("Pendidikan berhasil dihapus");
        fetchPendidikan();
      } else {
        setError(data.message || "Gagal menghapus pendidikan");
      }
    } catch (err) {
      setError("Terjadi kesalahan saat menghapus pendidikan");
    }
  };

  // Update pendidikan
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const updateData = {
        name: editingPendidikan.name,
        description: editingPendidikan.description,
      };

      const response = await fetch(
        `https://brainquiz0.up.railway.app/pendidikan/update-pendidikan/${editingPendidikan.id}`,
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
        alert("Pendidikan berhasil diperbarui");
        setEditingPendidikan(null);
        fetchPendidikan();
      } else {
        setError(data.message || "Gagal memperbarui pendidikan");
      }
    } catch (err) {
      setError("Terjadi kesalahan saat memperbarui pendidikan");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Daftar Pendidikan
              </h2>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {showAddForm ? "Batal" : "Tambah Pendidikan"}
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
                <p className="ml-3 text-gray-600">Memuat data pendidikan...</p>
              </div>
            )}

            {!isLoading && (
              <>
                {showAddForm && (
                  <div className="bg-gray-50 p-6 rounded-lg mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Tambah Pendidikan Baru
                    </h3>
                    <form onSubmit={handleAdd} className="space-y-4">
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Nama Pendidikan
                        </label>
                        <input
                          type="text"
                          id="name"
                          value={newPendidikan.name}
                          onChange={(e) =>
                            setNewPendidikan({
                              ...newPendidikan,
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
                          value={newPendidikan.description}
                          onChange={(e) =>
                            setNewPendidikan({
                              ...newPendidikan,
                              description: e.target.value,
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
                        Tambah Pendidikan
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
                          Aksi
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {pendidikan && pendidikan.length > 0 ? (
                        pendidikan.map((item) => (
                          <tr key={item.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              {editingPendidikan?.id === item.id ? (
                                <input
                                  type="text"
                                  value={editingPendidikan.name}
                                  onChange={(e) =>
                                    setEditingPendidikan({
                                      ...editingPendidikan,
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
                              {editingPendidikan?.id === item.id ? (
                                <input
                                  type="text"
                                  value={editingPendidikan.description}
                                  onChange={(e) =>
                                    setEditingPendidikan({
                                      ...editingPendidikan,
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
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              {editingPendidikan?.id === item.id ? (
                                <div className="flex space-x-3">
                                  <button
                                    onClick={handleUpdate}
                                    className="text-green-600 hover:text-green-900"
                                  >
                                    Simpan
                                  </button>
                                  <button
                                    onClick={() => setEditingPendidikan(null)}
                                    className="text-gray-600 hover:text-gray-900"
                                  >
                                    Batal
                                  </button>
                                </div>
                              ) : (
                                <div className="flex space-x-3">
                                  <button
                                    onClick={() => setEditingPendidikan(item)}
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
                            colSpan="3"
                            className="px-6 py-4 text-center text-sm text-gray-500"
                          >
                            Tidak ada data pendidikan
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

export default DaftarPendidikan;
