import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import LoginPage from "./LoginPage";
import SignupPage from "./SignupPage";
import DaftarKategori from "./pages/daftarKategori";

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  console.log("Protected Route Check:", { token, role, allowedRoles }); // Debug routing

  if (!token) {
    console.log("No token, redirecting to login"); // Debug redirect
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    console.log("Unauthorized role, redirecting to login"); // Debug redirect
    localStorage.removeItem("token"); // Hapus token jika role tidak sesuai
    localStorage.removeItem("role");
    return <Navigate to="/login" replace />;
  }

  console.log("Access granted to protected route"); // Debug access
  return children;
};

function App() {
  console.log("App component rendered"); // Debug app render

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route
            path="/kategori"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <DaftarKategori />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
