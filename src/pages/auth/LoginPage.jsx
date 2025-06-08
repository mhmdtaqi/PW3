import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { userAPI } from "../../services/quizApi";
import Button from "../../components/UI/Button";
import Input from "../../components/UI/Input";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (import.meta.env.DEV) {
        console.log("Mencoba login dengan:", { email });
      }

      const response = await userAPI.login({ email, password });

      if (import.meta.env.DEV) {
        console.log("Response dari server:", response);
      }

      if (response.success && response.data) {
        const { token, role, user_id, name } = response.data;

        // Use the login function from useAuth hook
        login({
          id: user_id,
          userId: user_id,
          name: name,
          userName: name,
          role: role,
          userRole: role
        }, token);

        // Redirect to dashboard
        navigate("/dashboard");
      } else {
        setError(response.message || "Format response tidak valid");
      }
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error("Error saat login:", err);
      }
      setError(err.message || "Terjadi kesalahan saat login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/30 to-purple-600/30 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-emerald-400/30 to-teal-600/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-purple-400/20 to-pink-600/20 rounded-full blur-3xl animate-pulse-slow"></div>
      </div>

      <div className="relative z-10 max-w-lg w-full space-y-12">
        {/* Revolutionary Header */}
        <div className="text-center animate-fade-in">
          <div className="flex justify-center mb-8">
            <div className="relative group">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 rounded-3xl flex items-center justify-center shadow-ultra animate-float group-hover:animate-glow">
                <svg className="w-12 h-12 text-white animate-pulse-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl blur opacity-40 group-hover:opacity-70 transition duration-700"></div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full border-4 border-white animate-pulse"></div>
            </div>
          </div>
          <div className="mb-8">
            <h2 className="text-6xl font-black gradient-text-rainbow bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4 animate-shimmer">
              Welcome Back!
            </h2>
            <div className="text-5xl animate-bounce-in mb-4">👋</div>
            <p className="text-slate-600 text-xl font-medium leading-relaxed">Silakan login untuk melanjutkan perjalanan belajar yang menakjubkan</p>
          </div>
        </div>

        {/* Revolutionary Login Form */}
        <div className="card-glass rounded-3xl shadow-ultra p-10 border border-white/30 animate-slide-up backdrop-ultra">
          {error && (
            <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 text-red-700 px-6 py-4 rounded-2xl mb-8 animate-fade-in flex items-center space-x-3 shadow-lg">
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="font-medium">{error}</span>
            </div>
          )}

          <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div className="relative group">
                <Input
                  label="Alamat Email"
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Masukkan alamat email Anda"
                  className="input-floating"
                />
                <div className="absolute right-4 top-12 text-slate-400 group-focus-within:text-blue-500 transition-colors duration-300">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
              </div>

              <div className="relative group">
                <Input
                  label="Kata Sandi"
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi Anda"
                  className="input-floating"
                />
                <div className="absolute right-4 top-12 text-slate-400 group-focus-within:text-blue-500 transition-colors duration-300">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full btn-primary text-lg py-4 font-black disabled:opacity-50 disabled:cursor-not-allowed">
              <div className="flex items-center justify-center space-x-3">
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                )}
                <span>{loading ? "Sedang Masuk..." : "Masuk ke Akun"}</span>
                {!loading && <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>}
              </div>
            </Button>

            <div className="text-center pt-4">
              <p className="text-slate-600 font-medium">
                Belum punya akun?{" "}
                <a
                  href="/register"
                  className="font-black gradient-text hover:scale-105 transition-transform duration-300 inline-block"
                >
                  Daftar Sekarang →
                </a>
              </p>
            </div>
          </form>
        </div>

        {/* Revolutionary Footer */}
        <div className="text-center animate-fade-in">
          <div className="glass-ultra rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-center space-x-2 mb-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center animate-pulse">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <span className="font-black gradient-text text-lg">BrainQuiz</span>
            </div>
            <p className="text-slate-600 font-medium">
              © 2024 Platform pembelajaran interaktif terbaik di Indonesia
            </p>
            <div className="flex justify-center space-x-4 mt-4">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
