import "@/App.css";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ScrollToTop } from "@/components/ScrollToTop";
import Home from "@/pages/Home";
import Leaderboard from "@/pages/Leaderboard";
import Teams from "@/pages/Teams";
import TeamDetail from "@/pages/TeamDetail";
import Schedule from "@/pages/Schedule";
import Gallery from "@/pages/Gallery";
import Brandon from "@/pages/Brandon";
import Rules from "@/pages/Rules";
import AdminLogin from "@/admin/AdminLogin";
import AdminLayout from "@/admin/AdminLayout";
import Dashboard from "@/admin/Dashboard";
import AnnouncementsAdmin from "@/admin/AnnouncementsAdmin";
import LeaderboardAdmin from "@/admin/LeaderboardAdmin";
import TeamsAdmin from "@/admin/TeamsAdmin";
import ScheduleAdmin from "@/admin/ScheduleAdmin";
import GalleryAdmin from "@/admin/GalleryAdmin";
import ContentAdmin from "@/admin/ContentAdmin";
import RulesAdmin from "@/admin/RulesAdmin";

const Shell = () => {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith("/admin");
  return (
    <>
      <ScrollToTop />
      {!isAdmin && <Navbar />}
      <main id="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/teams/:teamId" element={<TeamDetail />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/brandon" element={<Brandon />} />
          <Route path="/rules" element={<Rules />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="announcements" element={<AnnouncementsAdmin />} />
            <Route path="leaderboard" element={<LeaderboardAdmin />} />
            <Route path="teams" element={<TeamsAdmin />} />
            <Route path="schedule" element={<ScheduleAdmin />} />
            <Route path="gallery" element={<GalleryAdmin />} />
            <Route path="content" element={<ContentAdmin />} />
            <Route path="rules" element={<RulesAdmin />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {!isAdmin && <Footer />}
    </>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Shell />
      </BrowserRouter>
    </div>
  );
}

export default App;
