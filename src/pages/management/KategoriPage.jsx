<<<<<<< HEAD:src/pages/management/KategoriPage.jsx
import React from "react";
import DataTable from "../../components/DataTable";
import { api } from "../../services/api";

const DaftarKategori = () => {
  const fields = [
    { name: "name", label: "Nama Kategori" },
    { name: "description", label: "Deskripsi", type: "textarea" },
  ];

  // Fungsi untuk mentransformasi data
  const transformData = (data) => {
    console.log("Data sebelum transformasi:", data);
    if (!data || !Array.isArray(data)) {
      console.error("Data tidak valid:", data);
      return [];
    }
    return data.map((item) => ({
      id: item.ID || item.id, // Menggunakan ID dari GORM
      name: item.Name || item.name,
      description: item.Description || item.description,
    }));
  };

  const handleAdd = async (data) => {
    try {
      console.log("Data yang akan ditambahkan:", data);
      const response = await api.addKategori(data);
      console.log("Response dari server:", response);

      if (!response.success) {
        throw new Error(response.message || "Gagal menambahkan kategori");
      }
      alert("Kategori berhasil ditambahkan");
    } catch (error) {
      console.error("Error saat menambahkan kategori:", error);
      throw error;
    }
  };

  const handleEdit = async (id, data) => {
    try {
      const itemId = id || data?.id || data?.ID;
      if (!itemId) {
        throw new Error("ID kategori tidak ditemukan");
      }

      console.log("ID yang akan diupdate:", itemId);
      console.log("Data yang akan diupdate:", data);
      const response = await api.updateKategori(itemId, {
        name: data.name,
        description: data.description,
      });
      console.log("Response dari server:", response);

      if (!response.success) {
        throw new Error(response.message || "Gagal mengupdate kategori");
      }
      return true; // Return success instead of alert
    } catch (error) {
      console.error("Error saat mengupdate kategori:", error);
      throw error;
    }
  };

  const handleDelete = async (id) => {
    try {
      const itemId = typeof id === 'object' ? (id?.id || id?.ID) : id;
      if (!itemId) {
        throw new Error("ID kategori tidak ditemukan");
      }

      console.log("ID yang akan dihapus:", itemId);
      const response = await api.deleteKategori(itemId);
      console.log("Response dari server:", response);

      if (!response.success) {
        throw new Error(response.message || "Gagal menghapus kategori");
      }
      return true; // Return success instead of alert
    } catch (error) {
      console.error("Error saat menghapus kategori:", error);
      throw error;
    }
  };

  return (
    <DataTable
      title="Daftar Kategori"
      endpoint="https://brainquiz0.up.railway.app/kategori/get-kategori"
      fields={fields}
      onAdd={handleAdd}
      onEdit={handleEdit}
      onDelete={handleDelete}
      transformData={transformData}
    />
  );
};

export default DaftarKategori;
=======
import React from "react";
import DataTable from "../components/DataTable";
import { api } from "../services/api";

// Icon component for Kategori
const KategoriIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
  </svg>
);

const DaftarKategori = () => {
  const fields = [
    { name: "name", label: "Nama Kategori", required: true },
    { name: "description", label: "Deskripsi", type: "textarea", required: true },
  ];

  // Page configuration for styling and behavior
  const pageConfig = {
    icon: KategoriIcon,
    gradient: "from-blue-500 to-purple-600",
    description: "Kelola kategori pembelajaran untuk mengorganisir materi",
    stats: true
  };

  // Fungsi untuk mentransformasi data
  const transformData = (data) => {
    console.log("Data sebelum transformasi:", data);
    if (!data || !Array.isArray(data)) {
      console.error("Data tidak valid:", data);
      return [];
    }
    return data.map((item) => ({
      id: item.ID || item.id, // Menggunakan ID dari GORM
      name: item.Name || item.name,
      description: item.Description || item.description,
    }));
  };

  const handleAdd = async (data) => {
    try {
      console.log("Data yang akan ditambahkan:", data);
      const response = await api.addKategori(data);
      console.log("Response dari server:", response);

      if (!response.success) {
        throw new Error(response.message || "Gagal menambahkan kategori");
      }
      alert("Kategori berhasil ditambahkan");
      return true;
    } catch (error) {
      console.error("Error saat menambahkan kategori:", error);
      throw error;
    }
  };

  const handleEdit = async (id, data) => {
    try {
      if (!id) {
        throw new Error("ID kategori tidak ditemukan");
      }

      console.log("Data yang akan diupdate:", { id, data });
      const response = await api.updateKategori(id, {
        name: data.name,
        description: data.description,
      });
      console.log("Response dari server:", response);

      if (!response.success) {
        throw new Error(response.message || "Gagal mengupdate kategori");
      }
      alert("Kategori berhasil diperbarui");
      return true;
    } catch (error) {
      console.error("Error saat mengupdate kategori:", error);
      throw error;
    }
  };

  const handleDelete = async (id) => {
    try {
      if (!id) {
        throw new Error("ID kategori tidak ditemukan");
      }

      console.log("ID yang akan dihapus:", id);
      const response = await api.deleteKategori(id);
      console.log("Response dari server:", response);

      if (!response.success) {
        throw new Error(response.message || "Gagal menghapus kategori");
      }
      alert("Kategori berhasil dihapus");
      return true;
    } catch (error) {
      console.error("Error saat menghapus kategori:", error);
      throw error;
    }
  };

  return (
    <DataTable
      title="Daftar Kategori"
      endpoint="https://brainquiz0.up.railway.app/kategori/get-kategori"
      fields={fields}
      onAdd={handleAdd}
      onEdit={handleEdit}
      onDelete={handleDelete}
      transformData={transformData}
      pageConfig={pageConfig}
    />
  );
};

export default DaftarKategori;
>>>>>>> 2ef6045f5a78e89e8b56c0a3496f8360cddd6496:src/pages/daftarKategori.jsx
