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
import DaftarKuis from "./pages/daftarKuis";
import BuatSoal from "./pages/buatSoal";
import KuisSiswa from "./pages/kuisSiswa";
import JawabSoal from "./pages/jawabSoal";
import HasilKuis from "./pages/hasilKuis";
import DetailKelas from "./pages/DetailKelas";
import ManageSoal from "./pages/admin/ManageSoal";
import Navbar from "./components/Navbar";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
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
          path="/daftar-kuis"
          element={
            <PrivateRoute>
              <>
                <Navbar />
                <DaftarKuis />
              </>
            </PrivateRoute>
          }
        />
        <Route
          path="/kuis/:kuisId/soal"
          element={
            <PrivateRoute>
              <>
                <Navbar />
                <BuatSoal />
              </>
            </PrivateRoute>
          }
        />
        <Route
          path="/kuis-siswa"
          element={
            <PrivateRoute>
              <>
                <Navbar />
                <KuisSiswa />
              </>
            </PrivateRoute>
          }
        />
        <Route
          path="/kuis-siswa/:kuisId/jawab"
          element={
            <PrivateRoute>
              <>
                <Navbar />
                <JawabSoal />
              </>
            </PrivateRoute>
          }
        />
        <Route
          path="/hasil-kuis/:kuisId"
          element={
            <PrivateRoute>
              <>
                <Navbar />
                <HasilKuis />
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
        <Route
          path="/admin/manage-soal"
          element={
            <PrivateRoute>
              <>
                <Navbar />
                <ManageSoal />
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
