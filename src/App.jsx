import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./LoginPage";
import Register from "./SignupPage";
import Dashboard from "./dashboard";
import DaftarKategori from "./pages/daftarKategori";
import DaftarTingkatan from "./pages/daftarTingkatan";
import DaftarPendidikan from "./pages/daftarPendidikan";
import DaftarKelas from "./pages/daftarKelas";
import Navbar from "./components/Navbar";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <>
                <Navbar />
                <Dashboard />
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
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
