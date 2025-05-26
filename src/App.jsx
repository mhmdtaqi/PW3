import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import DaftarKategori from "./pages/daftarKategori";
import DaftarTingkatan from "./pages/daftarTingkatan";
import DaftarPendidikan from "./pages/daftarPendidikan";
import DaftarKelas from "./pages/daftarKelas";
import DetailKelas from "./pages/DetailKelas";
import Navbar from "./components/Navbar";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<SignupPage />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <>
                <Navbar />
                <DashboardPage />
              </>
            </PrivateRoute>
          }
        />
        <Route
          path="/daftar-kategori"
          element={
            <PrivateRoute>
              <>
                <Navbar />
                <DaftarKategori />
              </>
            </PrivateRoute>
          }
        />
        <Route
          path="/daftar-tingkatan"
          element={
            <PrivateRoute>
              <>
                <Navbar />
                <DaftarTingkatan />
              </>
            </PrivateRoute>
          }
        />
        <Route
          path="/daftar-pendidikan"
          element={
            <PrivateRoute>
              <>
                <Navbar />
                <DaftarPendidikan />
              </>
            </PrivateRoute>
          }
        />
        <Route
          path="/daftar-kelas"
          element={
            <PrivateRoute>
              <>
                <Navbar />
                <DaftarKelas />
              </>
            </PrivateRoute>
          }
        />
        <Route
          path="/kelas/:id"
          element={
            <PrivateRoute>
              <>
                <Navbar />
                <DetailKelas />
              </>
            </PrivateRoute>
          }
        />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
