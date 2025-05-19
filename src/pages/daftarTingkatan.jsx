import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const DaftarTingkatan = () => {
  const [tingkatan, setTingkatan] = useState([
    {
      id: 1,
      name: "Mudah",
      description: "Tingkat kesulitan untuk pemula",
    },
    {
      id: 2,
      name: "Sedang",
      description: "Tingkat kesulitan menengah",
    },
    {
      id: 3,
      name: "Sulit",
      description: "Tingkat kesulitan untuk yang sudah mahir",
    },
    {
      id: 4,
      name: "Sangat Sulit",
      description: "Tingkat kesulitan untuk ahli",
    },
  ]);
  const [error, setError] = useState("");
  const [editingTingkatan, setEditingTingkatan] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTingkatan, setNewTingkatan] = useState({
    name: "",
    description: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Fungsi untuk delay
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // Fetch tingkatan dengan retry
  const fetchTingkatan = async (retryCount = 0) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const authToken = `Bearer ${token}`;
      console.log("Token yang dikirim:", authToken);

      const response = await fetch(
        "https://brainquiz0.up.railway.app/tingkatan/get-tingkatan",
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
          setTingkatan(data.data);
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
            return fetchTingkatan(retryCount + 1);
          } else {
            setError(
              "Gagal mengambil data tingkatan setelah beberapa percobaan"
            );
            setIsLoading(false);
          }
        }
      }
    } catch (err) {
      if (retryCount < 3) {
        await delay(30000);
        return fetchTingkatan(retryCount + 1);
      } else {
        setError("Terjadi kesalahan saat mengambil data");
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    // fetchTingkatan(); // Dikomentari untuk sementara karena menggunakan data dummy
  }, []);

  // Add tingkatan
  const handleAdd = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const tingkatanData = {
        name: newTingkatan.name,
        description: newTingkatan.description,
      };

      const response = await fetch(
        "https://brainquiz0.up.railway.app/tingkatan/add-tingkatan",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(tingkatanData),
        }
      );
      const data = await response.json();

      if (response.ok) {
        alert("Tingkatan berhasil ditambahkan");
        setNewTingkatan({ name: "", description: "" });
        setShowAddForm(false);
        fetchTingkatan();
      } else {
        setError(data.message || "Gagal menambahkan tingkatan");
      }
    } catch (err) {
      setError("Terjadi kesalahan saat menambahkan tingkatan");
    }
  };

  // Delete tingkatan
  const handleDelete = async (id) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus tingkatan ini?"))
      return;

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(
        `https://brainquiz0.up.railway.app/tingkatan/delete-tingkatan/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();

      if (response.ok) {
        alert("Tingkatan berhasil dihapus");
        fetchTingkatan();
      } else {
        setError(data.message || "Gagal menghapus tingkatan");
      }
    } catch (err) {
      setError("Terjadi kesalahan saat menghapus tingkatan");
    }
  };

  // Update tingkatan
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const updateData = {
        name: editingTingkatan.name,
        description: editingTingkatan.description,
      };

      const response = await fetch(
        `https://brainquiz0.up.railway.app/tingkatan/update-tingkatan/${editingTingkatan.id}`,
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
        alert("Tingkatan berhasil diperbarui");
        setEditingTingkatan(null);
        fetchTingkatan();
      } else {
        setError(data.message || "Gagal memperbarui tingkatan");
      }
    } catch (err) {
      setError("Terjadi kesalahan saat memperbarui tingkatan");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Daftar Tingkatan
              </h2>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {showAddForm ? "Batal" : "Tambah Tingkatan"}
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
                <p className="ml-3 text-gray-600">Memuat data tingkatan...</p>
              </div>
            )}

            {!isLoading && (
              <>
                {showAddForm && (
                  <div className="bg-gray-50 p-6 rounded-lg mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Tambah Tingkatan Baru
                    </h3>
                    <form onSubmit={handleAdd} className="space-y-4">
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Nama Tingkatan
                        </label>
                        <input
                          type="text"
                          id="name"
                          value={newTingkatan.name}
                          onChange={(e) =>
                            setNewTingkatan({
                              ...newTingkatan,
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
                          value={newTingkatan.description}
                          onChange={(e) =>
                            setNewTingkatan({
                              ...newTingkatan,
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
                        Tambah Tingkatan
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
                      {tingkatan && tingkatan.length > 0 ? (
                        tingkatan.map((item) => (
                          <tr key={item.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              {editingTingkatan?.id === item.id ? (
                                <input
                                  type="text"
                                  value={editingTingkatan.name}
                                  onChange={(e) =>
                                    setEditingTingkatan({
                                      ...editingTingkatan,
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
                              {editingTingkatan?.id === item.id ? (
                                <input
                                  type="text"
                                  value={editingTingkatan.description}
                                  onChange={(e) =>
                                    setEditingTingkatan({
                                      ...editingTingkatan,
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
                              {editingTingkatan?.id === item.id ? (
                                <div className="flex space-x-3">
                                  <button
                                    onClick={handleUpdate}
                                    className="text-green-600 hover:text-green-900"
                                  >
                                    Simpan
                                  </button>
                                  <button
                                    onClick={() => setEditingTingkatan(null)}
                                    className="text-gray-600 hover:text-gray-900"
                                  >
                                    Batal
                                  </button>
                                </div>
                              ) : (
                                <div className="flex space-x-3">
                                  <button
                                    onClick={() => setEditingTingkatan(item)}
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
                            Tidak ada data tingkatan
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

export default DaftarTingkatan;
