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
import JoinKelasPage from "./pages/JoinKelasPage";
import KuisPage from "./pages/KuisPage";
import ManageSoalPage from "./pages/ManageSoalPage";
import AmbilKuisPage from "./pages/AmbilKuisPage";
import JawabKuisPage from "./pages/JawabKuisPage";
import HasilKuisPage from "./pages/HasilKuisPage";
import DetailHasilKuisPage from "./pages/DetailHasilKuisPage";
import ProfilPage from "./pages/ProfilPage";
import ManageSoal from "./pages/admin/ManageSoal";
import ManageKuis from "./pages/admin/ManageKuis";
import AnalyticsPage from "./pages/AnalyticsPage";
import RecommendationPage from "./pages/RecommendationPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import AchievementsPage from "./pages/AchievementsPage";
import StudyPlannerPage from "./pages/StudyPlannerPage";
import LayoutWrapper from "./components/LayoutWrapper";


const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
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
                <DaftarKategori />
              </LayoutWrapper>
            </PrivateRoute>
          }
        />
        <Route
          path="/daftar-tingkatan"
          element={
            <PrivateRoute>
              <LayoutWrapper>
                <DaftarTingkatan />
              </LayoutWrapper>
            </PrivateRoute>
          }
        />
        <Route
          path="/daftar-pendidikan"
          element={
            <PrivateRoute>
              <LayoutWrapper>
                <DaftarPendidikan />
              </LayoutWrapper>
            </PrivateRoute>
          }
        />
        <Route
          path="/daftar-kelas"
          element={
            <PrivateRoute>
              <LayoutWrapper>
                <DaftarKelas />
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
                <ManageSoal />
              </LayoutWrapper>
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/manage-kuis"
          element={
            <PrivateRoute>
              <LayoutWrapper>
                <ManageKuis />
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
  );
};

export default App;
