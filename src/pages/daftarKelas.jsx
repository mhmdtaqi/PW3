import React from "react";
import DataTable from "../components/DataTable";
import { api } from "../services/api";

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
