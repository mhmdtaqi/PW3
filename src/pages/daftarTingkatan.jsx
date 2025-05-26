import React from "react";
import DataTable from "../components/DataTable";
import { api } from "../services/api";

const DaftarTingkatan = () => {
  const fields = [
    { name: "name", label: "Nama Tingkatan" },
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
      const response = await api.addTingkatan(data);
      console.log("Response dari server:", response);

      if (!response.success) {
        throw new Error(response.message || "Gagal menambahkan tingkatan");
      }
      alert("Tingkatan berhasil ditambahkan");
    } catch (error) {
      console.error("Error saat menambahkan tingkatan:", error);
      throw error;
    }
  };

  const handleEdit = async (data) => {
    try {
      if (!data.id) {
        throw new Error("ID tingkatan tidak ditemukan");
      }

      console.log("Data yang akan diupdate:", data);
      const response = await api.updateTingkatan(data.id, {
        name: data.name,
        description: data.description,
      });
      console.log("Response dari server:", response);

      if (!response.success) {
        throw new Error(response.message || "Gagal mengupdate tingkatan");
      }
      alert("Tingkatan berhasil diperbarui");
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
    />
  );
};

export default DaftarTingkatan;
