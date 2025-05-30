import React from "react";
import DataTable from "../components/DataTable";
import { api } from "../services/api";

// Icon component for Tingkatan
const TingkatanIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const DaftarTingkatan = () => {
  const fields = [
    { name: "name", label: "Nama Tingkatan", required: true },
    { name: "description", label: "Deskripsi", type: "textarea", required: true },
  ];

  // Page configuration for styling and behavior
  const pageConfig = {
    icon: TingkatanIcon,
    gradient: "from-green-500 to-teal-600",
    description: "Kelola tingkatan kesulitan pembelajaran dengan mudah",
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
      const response = await api.addTingkatan(data);
      console.log("Response dari server:", response);

      if (!response.success) {
        throw new Error(response.message || "Gagal menambahkan tingkatan");
      }
      alert("Tingkatan berhasil ditambahkan");
      return true;
    } catch (error) {
      console.error("Error saat menambahkan tingkatan:", error);
      throw error;
    }
  };

  const handleEdit = async (id, data) => {
    try {
      if (!id) {
        throw new Error("ID tingkatan tidak ditemukan");
      }

      console.log("Data yang akan diupdate:", { id, data });
      const response = await api.updateTingkatan(id, {
        name: data.name,
        description: data.description,
      });
      console.log("Response dari server:", response);

      if (!response.success) {
        throw new Error(response.message || "Gagal mengupdate tingkatan");
      }
      alert("Tingkatan berhasil diperbarui");
      return true;
    } catch (error) {
      console.error("Error saat mengupdate tingkatan:", error);
      throw error;
    }
  };

  const handleDelete = async (id) => {
    try {
      if (!id) {
        throw new Error("ID tingkatan tidak ditemukan");
      }

      console.log("ID yang akan dihapus:", id);
      const response = await api.deleteTingkatan(id);
      console.log("Response dari server:", response);

      if (!response.success) {
        throw new Error(response.message || "Gagal menghapus tingkatan");
      }
      alert("Tingkatan berhasil dihapus");
      return true;
    } catch (error) {
      console.error("Error saat menghapus tingkatan:", error);
      throw error;
    }
  };

  return (
    <DataTable
      title="Daftar Tingkatan"
      endpoint="https://brainquiz0.up.railway.app/tingkatan/get-tingkatan"
      fields={fields}
      onAdd={handleAdd}
      onEdit={handleEdit}
      onDelete={handleDelete}
      transformData={transformData}
      pageConfig={pageConfig}
    />
  );
};

export default DaftarTingkatan;
