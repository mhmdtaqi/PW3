import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const DataTable = ({
  title,
  endpoint,
  fields,
  onAdd,
  onEdit,
  onDelete,
  transformData = (data) => data,
}) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState(
    fields.reduce((acc, field) => ({ ...acc, [field.name]: "" }), {})
  );
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const fetchData = async (retryCount = 0) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      // Cek content type
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
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
          setError(responseData.message || "Format data tidak valid");
        }
      } else {
        if (response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          navigate("/login");
        } else {
          if (retryCount < 3) {
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
        await delay(1000); // Tunggu 1 detik sebelum retry
        return fetchData(retryCount + 1);
      } else {
        setError(err.message || "Terjadi kesalahan saat mengambil data");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
    if (!showAddForm) return null;

    return (
      <div className="mb-4 p-4 bg-white rounded shadow">
        <h2 className="text-xl font-bold mb-4">
          {editingItem ? "Edit Data" : "Tambah Data"}
        </h2>
        <form onSubmit={editingItem ? handleUpdate : handleAdd}>
          {fields.map((field, index) => (
            <div key={`${field.name}-${index}`} className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
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
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required={field.required}
                />
              ) : (
                <input
                  type={field.type}
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
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required={field.required}
                />
              )}
            </div>
          ))}
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => {
                setEditingItem(null);
                setShowAddForm(false);
              }}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Batal
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              {editingItem ? "Update" : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
            <button
              onClick={() => setShowAddForm(true)}
              className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              Tambah Data
            </button>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg">
              {error}
            </div>
          )}

          {renderForm()}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.map((item) => (
              <div
                key={item.id}
                className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-100 transform hover:-translate-y-1"
              >
                <div className="p-6">
                  {fields.map((field) => (
                    <div key={field.name} className="mb-3 last:mb-0">
                      <div className="text-gray-800 font-medium group-hover:text-blue-600 transition-colors duration-200">
                        {item[field.name]}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 flex justify-end space-x-3 border-t border-gray-100">
                  <button
                    onClick={() => setEditingItem(item)}
                    className="px-4 py-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors duration-200 font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors duration-200 font-medium"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
