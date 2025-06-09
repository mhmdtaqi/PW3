<<<<<<< HEAD:src/pages/management/KelasPage.jsx
import React from "react";
import DataTable from "../../components/DataTable";
import { api } from "../../services/api";

const DaftarKelas = () => {
  const fields = [
    { name: "name", label: "Nama Kelas" },
    { name: "description", label: "Deskripsi", type: "textarea" },
  ];

  // Fungsi untuk mentransformasi data
  const transformData = (data) => {
    console.log(
      "Data sebelum transformasi (raw):",
      JSON.stringify(data, null, 2)
    );
    console.log("Tipe data:", typeof data);
    console.log("Apakah array:", Array.isArray(data));

    if (!data) {
      console.error("Data kosong");
      return [];
    }

    if (!Array.isArray(data)) {
      console.error("Data bukan array:", data);
      return [];
    }

    const transformed = data
      .filter((item) => {
        console.log("Checking item:", JSON.stringify(item, null, 2));
        return item && (item.Name || item.name);
      })
      .map((item) => {
        console.log("Mapping item:", item);
        return {
          id: item.ID || item.id,
          name: item.Name || item.name || "",
          description: item.Description || item.description || "",
        };
      });

    console.log("Data setelah transformasi:", transformed);
    return transformed;
  };

  const handleAdd = async (data) => {
    try {
      console.log("Data yang akan ditambahkan:", data);
      const response = await api.addKelas(data);
      console.log("Response dari server:", response);

      if (!response.success) {
        throw new Error(response.message || "Gagal menambahkan kelas");
      }
      alert("Kelas berhasil ditambahkan");
    } catch (error) {
      console.error("Error saat menambahkan kelas:", error);
      throw error;
    }
  };

  const handleEdit = async (id, data) => {
    try {
      const itemId = id || data?.id || data?.ID;
      if (!itemId) {
        throw new Error("ID kelas tidak ditemukan");
      }

      console.log("ID yang akan diupdate:", itemId);
      console.log("Data yang akan diupdate:", data);
      const response = await api.updateKelas(itemId, {
        name: data.name,
        description: data.description,
      });
      console.log("Response dari server:", response);

      if (!response.success) {
        throw new Error(response.message || "Gagal mengupdate kelas");
      }
      return true;
    } catch (error) {
      console.error("Error saat mengupdate kelas:", error);
      throw error;
    }
  };

  const handleDelete = async (id) => {
    try {
      const itemId = typeof id === 'object' ? (id?.id || id?.ID) : id;
      if (!itemId) {
        throw new Error("ID kelas tidak ditemukan");
      }

      console.log("ID yang akan dihapus:", itemId);
      const response = await api.deleteKelas(itemId);
      console.log("Response dari server:", response);

      if (!response.success) {
        throw new Error(response.message || "Gagal menghapus kelas");
      }
      return true;
    } catch (error) {
      console.error("Error saat menghapus kelas:", error);
      throw error;
    }
  };

  return (
    <DataTable
      title="Daftar Kelas"
      endpoint="https://brainquiz0.up.railway.app/kelas/get-kelas"
      fields={fields}
      onAdd={handleAdd}
      onEdit={handleEdit}
      onDelete={handleDelete}
      transformData={transformData}
    />
  );
};

export default DaftarKelas;
=======
import React from "react";
import DataTable from "../components/DataTable";
import { api } from "../services/api";

// Icon component for Kelas
const KelasIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const DaftarKelas = () => {
  const fields = [
    { name: "name", label: "Nama Kelas", required: true },
    { name: "description", label: "Deskripsi", type: "textarea", required: true },
  ];

  // Page configuration for styling and behavior
  const pageConfig = {
    icon: KelasIcon,
    gradient: "from-indigo-500 to-purple-600",
    description: "Kelola kelas pembelajaran untuk mengorganisir siswa dan materi",
    stats: true
  };

  // Fungsi untuk mentransformasi data
  const transformData = (data) => {
    console.log(
      "Data sebelum transformasi (raw):",
      JSON.stringify(data, null, 2)
    );
    console.log("Tipe data:", typeof data);
    console.log("Apakah array:", Array.isArray(data));

    if (!data) {
      console.error("Data kosong");
      return [];
    }

    if (!Array.isArray(data)) {
      console.error("Data bukan array:", data);
      return [];
    }

    const transformed = data
      .filter((item) => {
        console.log("Checking item:", JSON.stringify(item, null, 2));
        return item && (item.Name || item.name);
      })
      .map((item) => {
        console.log("Mapping item:", item);
        return {
          id: item.ID || item.id,
          name: item.Name || item.name || "",
          description: item.Description || item.description || "",
        };
      });

    console.log("Data setelah transformasi:", transformed);
    return transformed;
  };

  const handleAdd = async (data) => {
    try {
      console.log("Data yang akan ditambahkan:", data);
      const response = await api.addKelas(data);
      console.log("Response dari server:", response);

      if (!response.success) {
        throw new Error(response.message || "Gagal menambahkan kelas");
      }
      alert("Kelas berhasil ditambahkan");
      return true;
    } catch (error) {
      console.error("Error saat menambahkan kelas:", error);
      throw error;
    }
  };

  const handleEdit = async (id, data) => {
    try {
      if (!id) {
        throw new Error("ID kelas tidak ditemukan");
      }

      console.log("Data yang akan diupdate:", { id, data });
      const response = await api.updateKelas(id, {
        name: data.name,
        description: data.description,
      });
      console.log("Response dari server:", response);

      if (!response.success) {
        throw new Error(response.message || "Gagal mengupdate kelas");
      }
      alert("Kelas berhasil diperbarui");
      return true;
    } catch (error) {
      console.error("Error saat mengupdate kelas:", error);
      throw error;
    }
  };

  const handleDelete = async (id) => {
    try {
      if (!id) {
        throw new Error("ID kelas tidak ditemukan");
      }

      console.log("ID yang akan dihapus:", id);
      const response = await api.deleteKelas(id);
      console.log("Response dari server:", response);

      if (!response.success) {
        throw new Error(response.message || "Gagal menghapus kelas");
      }
      alert("Kelas berhasil dihapus");
      return true;
    } catch (error) {
      console.error("Error saat menghapus kelas:", error);
      throw error;
    }
  };

  return (
    <DataTable
      title="Daftar Kelas"
      endpoint="https://brainquiz0.up.railway.app/kelas/get-kelas"
      fields={fields}
      onAdd={handleAdd}
      onEdit={handleEdit}
      onDelete={handleDelete}
      transformData={transformData}
      pageConfig={pageConfig}
    />
  );
};

export default DaftarKelas;
>>>>>>> 2ef6045f5a78e89e8b56c0a3496f8360cddd6496:src/pages/daftarKelas.jsx
