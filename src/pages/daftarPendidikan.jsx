import React from "react";
import DataTable from "../components/DataTable";
import { api } from "../services/api";

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

  const handleEdit = async (data) => {
    try {
      if (!data.id) {
        throw new Error("ID pendidikan tidak ditemukan");
      }

      console.log("Data yang akan diupdate:", data);
      const response = await api.updatePendidikan(data.id, {
        name: data.name,
        description: data.description,
      });
      console.log("Response dari server:", response);

      if (!response.success) {
        throw new Error(response.message || "Gagal mengupdate pendidikan");
      }
      alert("Pendidikan berhasil diperbarui");
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
