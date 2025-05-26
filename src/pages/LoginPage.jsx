import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import Button from "../components/UI/Button";
import Input from "../components/UI/Input";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      console.log("Mencoba login dengan:", { email });

      const res = await fetch("https://brainquiz0.up.railway.app/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const response = await res.json();
      console.log("Response dari server:", response);

      if (res.ok) {
        if (response.success && response.data) {
          const token = response.data.token;
          const role = response.data.role;

          localStorage.setItem("token", token);
          localStorage.setItem("role", role);

          console.log("Login berhasil, token tersimpan:", token);
          navigate("/dashboard", { replace: true });
        } else {
          console.error("Format response tidak valid:", response);
          setError(response.message || "Format response tidak valid");
        }
      } else {
        console.error("Login gagal:", response);
        setError(response.message || "Login gagal");
      }
    } catch (err) {
      console.error("Error saat login:", err);
      setError("Terjadi kesalahan saat login");
    }
  };

  return (
    <Layout>
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-gray-800 mb-2">Welcome Back!</h2>
        <p className="text-gray-600">Silakan login untuk melanjutkan</p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 animate-fade-in">
          {error}
        </div>
      )}

      <form className="space-y-6" onSubmit={handleSubmit}>
        <Input
          label="Email"
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
        />

        <Input
          label="Password"
          id="password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
        />

        <Button type="submit">Login</Button>

        <p className="text-center text-sm text-gray-600">
          Belum punya akun?{" "}
          <a
            href="/register"
            className="font-medium text-blue-600 hover:text-teal-600 transition-colors duration-200"
          >
            Signup
          </a>
        </p>
      </form>
    </Layout>
  );
};

export default LoginPage;
