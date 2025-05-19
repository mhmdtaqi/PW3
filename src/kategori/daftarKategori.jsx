import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const DaftarKategori = () => {
  const [kategori, setKategori] = useState([]);
  const [error, setError] = useState("");
  const [editingKategori, setEditingKategori] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newKategori, setNewKategori] = useState({ name: "", description: "" });
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Fungsi untuk delay
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // Fetch kategori dengan retry
  const fetchKategori = async (retryCount = 0) => {
    try {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");

      console.log("Token dari localStorage:", token);
      console.log("Role dari localStorage:", role);

      if (!token) {
        navigate("/login");
        return;
      }

      if (role !== "admin") {
        setError("Anda tidak memiliki akses ke halaman ini");
        return;
      }

      // Tambahkan format Bearer saat mengirim request
      const authToken = `Bearer ${token}`;
      console.log("Token yang dikirim:", authToken);
      console.log(
        `Mencoba mengambil data kategori (percobaan ke-${retryCount + 1})...`
      );

      const response = await fetch(
        "https://brainquiz0.up.railway.app/kategori/get-kategori",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: authToken,
          },
        }
      );

      console.log("Status response:", response.status);
      const data = await response.json();
      console.log("Response data:", data);

      if (response.ok) {
        if (data.success && data.data) {
          setKategori(data.data);
          setIsLoading(false);
        } else {
          console.error("Format data tidak valid:", data);
          setError(data.message || "Format data tidak valid");
          setIsLoading(false);
        }
      } else {
        if (response.status === 401) {
          console.error("Unauthorized - menghapus token dan redirect ke login");
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          navigate("/login");
        } else {
          // Jika masih ada kesempatan retry
          if (retryCount < 3) {
            console.log(`Mencoba lagi dalam 30 detik... (${retryCount + 1}/3)`);
            await delay(30000); // Tunggu 30 detik
            return fetchKategori(retryCount + 1);
          } else {
            setError(
              data.message ||
                "Gagal mengambil data kategori setelah beberapa percobaan"
            );
            setIsLoading(false);
          }
        }
      }
    } catch (err) {
      console.error("Error saat fetch:", err);
      // Jika masih ada kesempatan retry
      if (retryCount < 3) {
        console.log(`Mencoba lagi dalam 30 detik... (${retryCount + 1}/3)`);
        await delay(30000); // Tunggu 30 detik
        return fetchKategori(retryCount + 1);
      } else {
        setError(
          "Terjadi kesalahan saat mengambil data setelah beberapa percobaan"
        );
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    console.log("Component mounted, memulai fetch data...");
    fetchKategori();
  }, []);

  // Add kategori
  const handleAdd = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const kategoriData = {
        name: newKategori.name,
        description: newKategori.description,
      };

      console.log("Menambah kategori:", kategoriData); // Debug request
      const response = await fetch(
        "https://brainquiz0.up.railway.app/kategori/add-kategori",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(kategoriData),
        }
      );
      const data = await response.json();
      console.log("Response add:", data); // Debug response

      if (response.ok) {
        alert("Kategori berhasil ditambahkan");
        setNewKategori({ name: "", description: "" });
        setShowAddForm(false);
        fetchKategori();
      } else {
        setError(data.message || "Gagal menambahkan kategori");
      }
    } catch (err) {
      console.error("Error saat add:", err);
      setError("Terjadi kesalahan saat menambahkan kategori");
    }
  };

  // Delete kategori
  const handleDelete = async (id) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus kategori ini?"))
      return;

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      console.log("Menghapus kategori:", id); // Debug request
      const response = await fetch(
        `https://brainquiz0.up.railway.app/kategori/delete-kategori/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      console.log("Response delete:", data); // Debug response

      if (response.ok) {
        alert("Kategori berhasil dihapus");
        fetchKategori();
      } else {
        setError(data.message || "Gagal menghapus kategori");
      }
    } catch (err) {
      console.error("Error saat delete:", err);
      setError("Terjadi kesalahan saat menghapus kategori");
    }
  };

  // Update kategori
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const updateData = {
        name: editingKategori.name,
        description: editingKategori.description,
      };

      console.log("Update kategori:", updateData); // Debug request
      const response = await fetch(
        `https://brainquiz0.up.railway.app/kategori/update-kategori/${editingKategori.ID}`,
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
      console.log("Response update:", data); // Debug response

      if (response.ok) {
        alert("Kategori berhasil diperbarui");
        setEditingKategori(null);
        fetchKategori();
      } else {
        setError(data.message || "Gagal memperbarui kategori");
      }
    } catch (err) {
      console.error("Error saat update:", err);
      setError("Terjadi kesalahan saat memperbarui kategori");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Daftar Kategori
              </h2>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {showAddForm ? "Batal" : "Tambah Kategori"}
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
                <p className="ml-3 text-gray-600">Memuat data kategori...</p>
              </div>
            )}

            {!isLoading && (
              <>
                {showAddForm && (
                  <div className="bg-gray-50 p-6 rounded-lg mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Tambah Kategori Baru
                    </h3>
                    <form onSubmit={handleAdd} className="space-y-4">
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Nama Kategori
                        </label>
                        <input
                          type="text"
                          id="name"
                          value={newKategori.name}
                          onChange={(e) =>
                            setNewKategori({
                              ...newKategori,
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
                          value={newKategori.description}
                          onChange={(e) =>
                            setNewKategori({
                              ...newKategori,
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
                        Tambah Kategori
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
                      {kategori && kategori.length > 0 ? (
                        kategori.map((item) => (
                          <tr key={item.ID} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              {editingKategori?.ID === item.ID ? (
                                <input
                                  type="text"
                                  value={editingKategori.name}
                                  onChange={(e) =>
                                    setEditingKategori({
                                      ...editingKategori,
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
                              {editingKategori?.ID === item.ID ? (
                                <input
                                  type="text"
                                  value={editingKategori.description}
                                  onChange={(e) =>
                                    setEditingKategori({
                                      ...editingKategori,
                                      description: e.target.value,
                                    })
                                  }
                                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                />
                              ) : (
                                <div className="text-sm text-gray-900">
                                  {item.description || "-"}
                                </div>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              {editingKategori?.ID === item.ID ? (
                                <div className="flex space-x-3">
                                  <button
                                    onClick={handleUpdate}
                                    className="text-green-600 hover:text-green-900"
                                  >
                                    Simpan
                                  </button>
                                  <button
                                    onClick={() => setEditingKategori(null)}
                                    className="text-gray-600 hover:text-gray-900"
                                  >
                                    Batal
                                  </button>
                                </div>
                              ) : (
                                <div className="flex space-x-3">
                                  <button
                                    onClick={() => setEditingKategori(item)}
                                    className="text-blue-600 hover:text-blue-900"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => handleDelete(item.ID)}
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
                            Tidak ada data kategori
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

export default DaftarKategori;
