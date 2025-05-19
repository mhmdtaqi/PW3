import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const DaftarUser = () => {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Admin Utama",
      email: "admin@brainquiz.com",
      role: "admin",
      created_at: "2024-03-15",
    },
    {
      id: 2,
      name: "Guru Matematika",
      email: "guru.math@brainquiz.com",
      role: "guru",
      created_at: "2024-03-16",
    },
    {
      id: 3,
      name: "Siswa A",
      email: "siswa.a@brainquiz.com",
      role: "siswa",
      created_at: "2024-03-17",
    },
    {
      id: 4,
      name: "Guru Bahasa",
      email: "guru.bahasa@brainquiz.com",
      role: "guru",
      created_at: "2024-03-18",
    },
    {
      id: 5,
      name: "Siswa B",
      email: "siswa.b@brainquiz.com",
      role: "siswa",
      created_at: "2024-03-19",
    },
  ]);
  const [error, setError] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "siswa",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Cek role user
    const role = localStorage.getItem("role");
    if (role !== "admin") {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleAdd = async (e) => {
    e.preventDefault();
    setError("");
    try {
      // Simulasi penambahan user
      const newId = users.length + 1;
      const userToAdd = {
        id: newId,
        ...newUser,
        created_at: new Date().toISOString().split("T")[0],
      };
      setUsers([...users, userToAdd]);
      setNewUser({ name: "", email: "", password: "", role: "siswa" });
      setShowAddForm(false);
    } catch (err) {
      setError("Terjadi kesalahan saat menambahkan user");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus user ini?")) return;

    try {
      setUsers(users.filter((user) => user.id !== id));
    } catch (err) {
      setError("Terjadi kesalahan saat menghapus user");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setUsers(
        users.map((user) =>
          user.id === editingUser.id ? { ...user, ...editingUser } : user
        )
      );
      setEditingUser(null);
    } catch (err) {
      setError("Terjadi kesalahan saat memperbarui user");
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800";
      case "guru":
        return "bg-blue-100 text-blue-800";
      case "siswa":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Daftar User</h2>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Tambah User
          </button>
        </div>

        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Nama
                  </th>
                  <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Tanggal Dibuat
                  </th>
                  <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">
                      {user.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeColor(
                          user.role
                        )}`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">
                      {user.created_at}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">
                      <button
                        onClick={() => setEditingUser(user)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Form Tambah User */}
      {showAddForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Tambah User Baru
              </h3>
              <form onSubmit={handleAdd} className="mt-4">
                <div className="mt-2 px-7 py-3">
                  <input
                    type="text"
                    placeholder="Nama"
                    value={newUser.name}
                    onChange={(e) =>
                      setNewUser({ ...newUser, name: e.target.value })
                    }
                    className="mb-3 px-3 py-2 border rounded-lg w-full"
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={newUser.email}
                    onChange={(e) =>
                      setNewUser({ ...newUser, email: e.target.value })
                    }
                    className="mb-3 px-3 py-2 border rounded-lg w-full"
                    required
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={newUser.password}
                    onChange={(e) =>
                      setNewUser({ ...newUser, password: e.target.value })
                    }
                    className="mb-3 px-3 py-2 border rounded-lg w-full"
                    required
                  />
                  <select
                    value={newUser.role}
                    onChange={(e) =>
                      setNewUser({ ...newUser, role: e.target.value })
                    }
                    className="px-3 py-2 border rounded-lg w-full"
                    required
                  >
                    <option value="siswa">Siswa</option>
                    <option value="guru">Guru</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="items-center px-4 py-3">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  >
                    Simpan
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="ml-3 px-4 py-2 bg-gray-100 text-gray-700 text-base font-medium rounded-md shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
                  >
                    Batal
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Form Edit User */}
      {editingUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Edit User
              </h3>
              <form onSubmit={handleUpdate} className="mt-4">
                <div className="mt-2 px-7 py-3">
                  <input
                    type="text"
                    placeholder="Nama"
                    value={editingUser.name}
                    onChange={(e) =>
                      setEditingUser({
                        ...editingUser,
                        name: e.target.value,
                      })
                    }
                    className="mb-3 px-3 py-2 border rounded-lg w-full"
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={editingUser.email}
                    onChange={(e) =>
                      setEditingUser({
                        ...editingUser,
                        email: e.target.value,
                      })
                    }
                    className="mb-3 px-3 py-2 border rounded-lg w-full"
                    required
                  />
                  <select
                    value={editingUser.role}
                    onChange={(e) =>
                      setEditingUser({
                        ...editingUser,
                        role: e.target.value,
                      })
                    }
                    className="px-3 py-2 border rounded-lg w-full"
                    required
                  >
                    <option value="siswa">Siswa</option>
                    <option value="guru">Guru</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="items-center px-4 py-3">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  >
                    Simpan
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingUser(null)}
                    className="ml-3 px-4 py-2 bg-gray-100 text-gray-700 text-base font-medium rounded-md shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
                  >
                    Batal
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DaftarUser;
