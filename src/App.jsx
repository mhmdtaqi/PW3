<<<<<<< HEAD
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import ErrorBoundary from "./components/common/ErrorBoundary";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import KategoriPage from "./pages/management/KategoriPage";
import TingkatanPage from "./pages/management/TingkatanPage";
import PendidikanPage from "./pages/management/PendidikanPage";
import KelasPage from "./pages/management/KelasPage";
import MyClassesPage from "./pages/teacher/MyClassesPage";
import DetailKelas from "./pages/teacher/DetailKelas";
import JoinKelasPage from "./pages/student/JoinKelasPage";
import KuisPage from "./pages/KuisPage";
import ManageSoalPage from "./pages/teacher/ManageSoalPage";
import AmbilKuisPage from "./pages/student/AmbilKuisPage";
import JawabKuisPage from "./pages/quiz/JawabKuisPage";
import HasilKuisPage from "./pages/student/HasilKuisPage";
import DetailHasilKuisPage from "./pages/student/DetailHasilKuisPage";
import ProfilPage from "./pages/ProfilPage";
import SoalManagementPage from "./pages/admin/SoalManagementPage";
import KuisManagementPage from "./pages/admin/KuisManagementPage";
import AnalyticsPage from "./pages/admin/AnalyticsPage";
import RecommendationPage from "./pages/admin/RecommendationPage";
import LeaderboardPage from "./pages/student/LeaderboardPage";
import AchievementsPage from "./pages/student/AchievementsPage";
import StudyPlannerPage from "./pages/student/StudyPlannerPage";
import LayoutWrapper from "./components/LayoutWrapper";


const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
};

const App = () => {
  return (
    <ErrorBoundary>
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
              <LayoutWrapper>
                <DashboardPage />
              </LayoutWrapper>
            </PrivateRoute>
          }
        />
        <Route
          path="/daftar-kategori"
          element={
            <PrivateRoute>
              <LayoutWrapper>
                <KategoriPage />
              </LayoutWrapper>
            </PrivateRoute>
          }
        />
        <Route
          path="/daftar-tingkatan"
          element={
            <PrivateRoute>
              <LayoutWrapper>
                <TingkatanPage />
              </LayoutWrapper>
            </PrivateRoute>
          }
        />
        <Route
          path="/daftar-pendidikan"
          element={
            <PrivateRoute>
              <LayoutWrapper>
                <PendidikanPage />
              </LayoutWrapper>
            </PrivateRoute>
          }
        />
        <Route
          path="/daftar-kelas"
          element={
            <PrivateRoute>
              <LayoutWrapper>
                <KelasPage />
              </LayoutWrapper>
            </PrivateRoute>
          }
        />
        <Route
          path="/my-classes"
          element={
            <PrivateRoute>
              <LayoutWrapper>
                <MyClassesPage />
              </LayoutWrapper>
            </PrivateRoute>
          }
        />
        <Route
          path="/kelas/:id"
          element={
            <PrivateRoute>
              <LayoutWrapper>
                <DetailKelas />
              </LayoutWrapper>
            </PrivateRoute>
          }
        />
        <Route
          path="/join-kelas"
          element={
            <PrivateRoute>
              <LayoutWrapper>
                <JoinKelasPage />
              </LayoutWrapper>
            </PrivateRoute>
          }
        />
        <Route
          path="/daftar-kuis"
          element={
            <PrivateRoute>
              <LayoutWrapper>
                <KuisPage />
              </LayoutWrapper>
            </PrivateRoute>
          }
        />
        <Route
          path="/kuis/:kuisId/manage-soal"
          element={
            <PrivateRoute>
              <LayoutWrapper>
                <ManageSoalPage />
              </LayoutWrapper>
            </PrivateRoute>
          }
        />
        <Route
          path="/ambil-kuis"
          element={
            <PrivateRoute>
              <LayoutWrapper>
                <AmbilKuisPage />
              </LayoutWrapper>
            </PrivateRoute>
          }
        />
        <Route
          path="/kuis/:kuisId/jawab"
          element={
            <PrivateRoute>
              <LayoutWrapper>
                <JawabKuisPage />
              </LayoutWrapper>
            </PrivateRoute>
          }
        />
        <Route
          path="/hasil-kuis"
          element={
            <PrivateRoute>
              <LayoutWrapper>
                <HasilKuisPage />
              </LayoutWrapper>
            </PrivateRoute>
          }
        />
        <Route
          path="/hasil-kuis/:kuisId/detail"
          element={
            <PrivateRoute>
              <LayoutWrapper>
                <DetailHasilKuisPage />
              </LayoutWrapper>
            </PrivateRoute>
          }
        />
        <Route
          path="/profil"
          element={
            <PrivateRoute>
              <LayoutWrapper>
                <ProfilPage />
              </LayoutWrapper>
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/manage-soal"
          element={
            <PrivateRoute>
              <LayoutWrapper>
                <SoalManagementPage />
              </LayoutWrapper>
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/manage-kuis"
          element={
            <PrivateRoute>
              <LayoutWrapper>
                <KuisManagementPage />
              </LayoutWrapper>
            </PrivateRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <PrivateRoute>
              <LayoutWrapper>
                <AnalyticsPage />
              </LayoutWrapper>
            </PrivateRoute>
          }
        />
        <Route
          path="/recommendations"
          element={
            <PrivateRoute>
              <LayoutWrapper>
                <RecommendationPage />
              </LayoutWrapper>
            </PrivateRoute>
          }
        />
        <Route
          path="/leaderboard"
          element={
            <PrivateRoute>
              <LayoutWrapper>
                <LeaderboardPage />
              </LayoutWrapper>
            </PrivateRoute>
          }
        />
        <Route
          path="/achievements"
          element={
            <PrivateRoute>
              <LayoutWrapper>
                <AchievementsPage />
              </LayoutWrapper>
            </PrivateRoute>
          }
        />
        <Route
          path="/study-planner"
          element={
            <PrivateRoute>
              <LayoutWrapper>
                <StudyPlannerPage />
              </LayoutWrapper>
            </PrivateRoute>
          }
        />

        <Route path="/" element={<Navigate to="/login" />} />


        </Routes>
      </Router>
    </ErrorBoundary>
  );
};

export default App;
=======
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
>>>>>>> 2ef6045f5a78e89e8b56c0a3496f8360cddd6496
