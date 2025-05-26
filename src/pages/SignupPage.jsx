import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import Button from "../components/UI/Button";
import Input from "../components/UI/Input";
import Select from "../components/UI/Select";

const SignupPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    // Validasi role
    if (
      !role ||
      (role !== "admin" && role !== "teacher" && role !== "student")
    ) {
      setError("Role tidak valid. Pilih role: admin, teacher, atau student");
      return;
    }

    try {
      const res = await fetch(
        "https://brainquiz0.up.railway.app/user/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password, role }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        alert("Pendaftaran berhasil");
        navigate("/login");
      } else {
        setError(data.message || "Pendaftaran gagal");
      }
    } catch (err) {
      setError("Terjadi kesalahan");
    }
  };

  return (
    <Layout>
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-gray-800 mb-2">
          Create Account
        </h2>
        <p className="text-gray-600">Bergabunglah dengan kami hari ini</p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 animate-fade-in">
          {error}
        </div>
      )}

      <form className="space-y-6" onSubmit={handleSignup}>
        <div className="space-y-4">
          <Input
            label="Nama Lengkap"
            id="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Masukkan nama lengkap"
          />

          <Input
            label="Email"
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Masukkan email"
          />

          <Input
            label="Password"
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Masukkan password"
          />

          <Select
            label="Pilih Role"
            id="role"
            required
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="" className="bg-white text-gray-900">
              Pilih role
            </option>
            <option value="teacher" className="bg-white text-gray-900">
              Guru
            </option>
            <option value="student" className="bg-white text-gray-900">
              Siswa
            </option>
          </Select>
        </div>

        <Button type="submit">Daftar</Button>

        <p className="text-center text-sm text-gray-600">
          Sudah punya akun?{" "}
          <a
            href="/login"
            className="font-medium text-blue-600 hover:text-teal-600 transition-colors duration-200"
          >
            Login di sini
          </a>
        </p>
      </form>
    </Layout>
  );
};

export default SignupPage;
