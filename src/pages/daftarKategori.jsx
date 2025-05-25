import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const DaftarKategori = () => {
  const [kategori, setKategori] = useState([]);
  const [error, setError] = useState("");
  const [editingKategori, setEditingKategori] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newKategori, setNewKategori] = useState({ name: "", description: "" });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Fungsi untuk delay
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // Fetch kategori dengan retry
  const fetchKategori = async (retryCount = 0) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
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

      console.log("Status response:", response);
      const data = await response.json();
      console.log(data)

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
     fetchKategori(); // Dikomentari untuk sementara karena menggunakan data dummy
    setIsLoading(false); // Set loading ke false karena menggunakan data dummy
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
        `https://brainquiz0.up.railway.app/kategori/update-kategori/${editingKategori.id}`,
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
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white mx-8 md:mx-0 shadow rounded-3xl sm:p-10">
          <div className="max-w-md mx-auto">
            <div className="flex items-center space-x-5">
              <div className="block pl-2 font-semibold text-xl text-gray-700">
                <h2 className="leading-relaxed">Daftar Kategori</h2>
              </div>
            </div>
            {error && (
              <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                {error}
              </div>
            )}
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <div className="flex justify-end mb-4">
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Tambah Kategori
                  </button>
                </div>
                {isLoading ? (
                  <div className="text-center">Loading...</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                      <thead>
                        <tr>
                          <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Nama
                          </th>
                          <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Deskripsi
                          </th>
                          <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Aksi
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white">
                        {kategori.map((item) => (
                          <tr key={item.id}>
                            <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">
                              {item.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">
                              {item.description}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">
                              <button
                                onClick={() => setEditingKategori(item)}
                                className="text-indigo-600 hover:text-indigo-900 mr-4"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(item.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Hapus
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Tambah Kategori */}
      {showAddForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Tambah Kategori Baru
              </h3>
              <form onSubmit={handleAdd} className="mt-4">
                <div className="mt-2 px-7 py-3">
                  <input
                    type="text"
                    placeholder="Nama Kategori"
                    value={newKategori.name}
                    onChange={(e) =>
                      setNewKategori({ ...newKategori, name: e.target.value })
                    }
                    className="mb-3 px-3 py-2 border rounded-lg w-full"
                    required
                  />
                  <textarea
                    placeholder="Deskripsi"
                    value={newKategori.description}
                    onChange={(e) =>
                      setNewKategori({
                        ...newKategori,
                        description: e.target.value,
                      })
                    }
                    className="px-3 py-2 border rounded-lg w-full"
                    required
                  />
                </div>
                <div className="items-center px-4 py-3">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  >
                    Simpan
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="ml-3 px-4 py-2 bg-gray-100 text-gray-700 text-base font-medium rounded-md shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
                  >
                    Batal
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Form Edit Kategori */}
      {editingKategori && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Edit Kategori
              </h3>
              <form onSubmit={handleUpdate} className="mt-4">
                <div className="mt-2 px-7 py-3">
                  <input
                    type="text"
                    placeholder="Nama Kategori"
                    value={editingKategori.name}
                    onChange={(e) =>
                      setEditingKategori({
                        ...editingKategori,
                        name: e.target.value,
                      })
                    }
                    className="mb-3 px-3 py-2 border rounded-lg w-full"
                    required
                  />
                  <textarea
                    placeholder="Deskripsi"
                    value={editingKategori.description}
                    onChange={(e) =>
                      setEditingKategori({
                        ...editingKategori,
                        description: e.target.value,
                      })
                    }
                    className="px-3 py-2 border rounded-lg w-full"
                    required
                  />
                </div>
                <div className="items-center px-4 py-3">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  >
                    Simpan
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingKategori(null)}
                    className="ml-3 px-4 py-2 bg-gray-100 text-gray-700 text-base font-medium rounded-md shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
                  >
                    Batal
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DaftarKategori;
