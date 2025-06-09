<<<<<<< HEAD:src/pages/management/PendidikanPage.jsx
import React from "react";
import DataTable from "../../components/DataTable";
import { api } from "../../services/api";

const DaftarPendidikan = () => {
  const fields = [
    { name: "name", label: "Nama Pendidikan" },
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
      const response = await api.addPendidikan(data);
      console.log("Response dari server:", response);

      if (!response.success) {
        throw new Error(response.message || "Gagal menambahkan pendidikan");
      }
      alert("Pendidikan berhasil ditambahkan");
    } catch (error) {
      console.error("Error saat menambahkan pendidikan:", error);
      throw error;
    }
  };

  const handleEdit = async (id, data) => {
    try {
      const itemId = id || data?.id || data?.ID;
      if (!itemId) {
        throw new Error("ID pendidikan tidak ditemukan");
      }

      console.log("ID yang akan diupdate:", itemId);
      console.log("Data yang akan diupdate:", data);
      const response = await api.updatePendidikan(itemId, {
        name: data.name,
        description: data.description,
      });
      console.log("Response dari server:", response);

      if (!response.success) {
        throw new Error(response.message || "Gagal mengupdate pendidikan");
      }
      return true;
    } catch (error) {
      console.error("Error saat mengupdate pendidikan:", error);
      throw error;
    }
  };

  const handleDelete = async (id) => {
    try {
      const itemId = typeof id === 'object' ? (id?.id || id?.ID) : id;
      if (!itemId) {
        throw new Error("ID pendidikan tidak ditemukan");
      }

      console.log("ID yang akan dihapus:", itemId);
      const response = await api.deletePendidikan(itemId);
      console.log("Response dari server:", response);

      if (!response.success) {
        throw new Error(response.message || "Gagal menghapus pendidikan");
      }
      return true;
    } catch (error) {
      console.error("Error saat menghapus pendidikan:", error);
      throw error;
    }
  };

  return (
    <DataTable
      title="Daftar Pendidikan"
      endpoint="https://brainquiz0.up.railway.app/pendidikan/get-pendidikan"
      fields={fields}
      onAdd={handleAdd}
      onEdit={handleEdit}
      onDelete={handleDelete}
      transformData={transformData}
    />
  );
};

export default DaftarPendidikan;
=======
import React from "react";
import DataTable from "../components/DataTable";
import { api } from "../services/api";

// Icon component for Pendidikan
const PendidikanIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const DaftarPendidikan = () => {
  const fields = [
    { name: "name", label: "Nama Pendidikan", required: true },
    { name: "description", label: "Deskripsi", type: "textarea", required: true },
  ];

  // Page configuration for styling and behavior
  const pageConfig = {
    icon: PendidikanIcon,
    gradient: "from-orange-500 to-red-600",
    description: "Kelola jenjang pendidikan untuk menyesuaikan materi pembelajaran",
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
      const response = await api.addPendidikan(data);
      console.log("Response dari server:", response);

      if (!response.success) {
        throw new Error(response.message || "Gagal menambahkan pendidikan");
      }
      alert("Pendidikan berhasil ditambahkan");
      return true;
    } catch (error) {
      console.error("Error saat menambahkan pendidikan:", error);
      throw error;
    }
  };

  const handleEdit = async (id, data) => {
    try {
      if (!id) {
        throw new Error("ID pendidikan tidak ditemukan");
      }

      console.log("Data yang akan diupdate:", { id, data });
      const response = await api.updatePendidikan(id, {
        name: data.name,
        description: data.description,
      });
      console.log("Response dari server:", response);

      if (!response.success) {
        throw new Error(response.message || "Gagal mengupdate pendidikan");
      }
      alert("Pendidikan berhasil diperbarui");
      return true;
    } catch (error) {
      console.error("Error saat mengupdate pendidikan:", error);
      throw error;
    }
  };

  const handleDelete = async (id) => {
    try {
      if (!id) {
        throw new Error("ID pendidikan tidak ditemukan");
      }

      console.log("ID yang akan dihapus:", id);
      const response = await api.deletePendidikan(id);
      console.log("Response dari server:", response);

      if (!response.success) {
        throw new Error(response.message || "Gagal menghapus pendidikan");
      }
      alert("Pendidikan berhasil dihapus");
      return true;
    } catch (error) {
      console.error("Error saat menghapus pendidikan:", error);
      throw error;
    }
  };

  return (
    <DataTable
      title="Daftar Pendidikan"
      endpoint="https://brainquiz0.up.railway.app/pendidikan/get-pendidikan"
      fields={fields}
      onAdd={handleAdd}
      onEdit={handleEdit}
      onDelete={handleDelete}
      transformData={transformData}
      pageConfig={pageConfig}
    />
  );
};

export default DaftarPendidikan;
>>>>>>> 2ef6045f5a78e89e8b56c0a3496f8360cddd6496:src/pages/daftarPendidikan.jsx
