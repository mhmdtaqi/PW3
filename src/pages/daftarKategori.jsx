import React from "react";
import DataTable from "../components/DataTable";
import { api } from "../services/api";

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

  const handleEdit = async (data) => {
    try {
      if (!data.id) {
        throw new Error("ID kategori tidak ditemukan");
      }

      console.log("Data yang akan diupdate:", data);
      const response = await api.updateKategori(data.id, {
        name: data.name,
        description: data.description,
      });
      console.log("Response dari server:", response);

      if (!response.success) {
        throw new Error(response.message || "Gagal mengupdate kategori");
      }
      alert("Kategori berhasil diperbarui");
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
