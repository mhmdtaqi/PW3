import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../services/api";
import DataTable from "../components/DataTable";

const DaftarKelas = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const fields = [
    { key: "name", label: "Nama Kelas" },
    { key: "description", label: "Deskripsi" },
    {
      key: "actions",
      label: "Aksi",
      render: (row) => (
        <div className="flex space-x-2">
          <Link
            to={`/kelas/${row.id}`}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Lihat Detail
          </Link>
        </div>
      ),
    },
  ];

  const transformData = (data) => {
    console.log("Data sebelum transformasi:", data);
    if (!data || !data.data) {
      console.error("Data tidak valid:", data);
      return [];
    }

    const transformed = data.data.map((item) => ({
      id: item.ID || item.id || item._id,
      name: item.Name || item.name,
      description: item.Description || item.description,
    }));

    console.log("Data setelah transformasi:", transformed);
    return transformed;
  };

  const handleAdd = async (data) => {
    try {
      console.log("Menambahkan data:", data);
      const formattedData = {
        name: data.name,
        description: data.description,
      };
      const response = await api.addKelas(formattedData);
      console.log("Response addKelas:", response);
      if (!response.success) {
        throw new Error(response.message || "Gagal menambahkan kelas");
      }
      return true;
    } catch (error) {
      console.error("Error saat menambahkan kelas:", error);
      setError(error.message);
      return false;
    }
  };

  const handleEdit = async (id, data) => {
    try {
      console.log("Mengupdate data:", { id, data });
      const formattedData = {
        name: data.name,
        description: data.description,
      };
      const response = await api.updateKelas(id, formattedData);
      console.log("Response updateKelas:", response);
      if (!response.success) {
        throw new Error(response.message || "Gagal mengupdate kelas");
      }
      return true;
    } catch (error) {
      console.error("Error saat mengupdate kelas:", error);
      setError(error.message);
      return false;
    }
  };

  const handleDelete = async (id) => {
    try {
      console.log("Menghapus data dengan ID:", id);
      const response = await api.deleteKelas(id);
      console.log("Response deleteKelas:", response);
      if (!response.success) {
        throw new Error(response.message || "Gagal menghapus kelas");
      }
      return true;
    } catch (error) {
      console.error("Error saat menghapus kelas:", error);
      setError(error.message);
      return false;
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Daftar Kelas</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <DataTable
        fields={fields}
        fetchData={api.getKelas}
        transformData={transformData}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        addFormFields={[
          { name: "name", label: "Nama Kelas", type: "text", required: true },
          {
            name: "description",
            label: "Deskripsi",
            type: "textarea",
            required: true,
          },
        ]}
        editFormFields={[
          { name: "name", label: "Nama Kelas", type: "text", required: true },
          {
            name: "description",
            label: "Deskripsi",
            type: "textarea",
            required: true,
          },
        ]}
      />
    </div>
  );
};

export default DaftarKelas;
