import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUserData } from "../utils/userApi";
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
          const userId = response.data.user_id || response.data.id;

          localStorage.setItem("token", token);
          localStorage.setItem("role", role);

          // Store user ID if available
          if (userId) {
            localStorage.setItem("userId", userId);
            console.log("User ID tersimpan:", userId);
          } else {
            // Try to extract from token
            try {
              const payload = JSON.parse(atob(token.split('.')[1]));
              const extractedUserId = payload.iss || payload.user_id || payload.id;
              if (extractedUserId) {
                localStorage.setItem("userId", extractedUserId);
                console.log("User ID extracted from token:", extractedUserId);
              }
            } catch (e) {
              console.warn("Could not extract user ID from token");
            }
          }

          console.log("Login berhasil, token tersimpan:", token);
          console.log("Full login response:", response.data);

          // Fetch complete user data from API
          try {
            const userData = await fetchUserData();
            console.log("User data fetched:", userData);
            console.log("User role from API:", userData.role);
            console.log("User name from API:", userData.name);
          } catch (userError) {
            console.warn("Could not fetch user data, using login response:", userError);
          }

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
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
        </div>
        <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Welcome Back!
        </h2>
        <p className="text-gray-600 text-lg">Silakan login untuk melanjutkan pembelajaran Anda</p>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg mb-6 animate-pulse">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        </div>
      )}

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <Input
            label="Email"
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Masukkan email Anda"
          />

          <Input
            label="Password"
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Masukkan password Anda"
          />
        </div>

        <div className="pt-4">
          <Button type="submit">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            Masuk ke BrainQuiz
          </Button>
        </div>

        <div className="text-center pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Belum punya akun?{" "}
            <a
              href="/register"
              className="font-semibold text-blue-600 hover:text-purple-600 transition-colors duration-200 hover:underline"
            >
              Daftar Sekarang
            </a>
          </p>
        </div>
      </form>
    </Layout>
  );
};

export default LoginPage;
