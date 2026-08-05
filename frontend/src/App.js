import "@/App.css";
import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { MotionConfig, motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ScrollToTop } from "@/components/ScrollToTop";
import { useLenis } from "@/hooks/useLenis";
import Home from "@/pages/Home";
import Leaderboard from "@/pages/Leaderboard";
import Champions from "@/pages/Champions";
import ChampionDetail from "@/pages/ChampionDetail";
import CaptainScoring from "@/pages/CaptainScoring";
import Course from "@/pages/Course";
import Teams from "@/pages/Teams";
import TeamDetail from "@/pages/TeamDetail";
import Schedule from "@/pages/Schedule";
import Gallery from "@/pages/Gallery";
import Brandon from "@/pages/Brandon";
import Rules from "@/pages/Rules";
import Draft from "@/pages/Draft";
import Committee from "@/pages/Committee";
import AdminLogin from "@/admin/AdminLogin";
import AdminLayout from "@/admin/AdminLayout";
import Dashboard from "@/admin/Dashboard";
import AnnouncementsAdmin from "@/admin/AnnouncementsAdmin";
import TeamsAdmin from "@/admin/TeamsAdmin";
import ScheduleAdmin from "@/admin/ScheduleAdmin";
import GalleryAdmin from "@/admin/GalleryAdmin";
import ContentAdmin from "@/admin/ContentAdmin";
import RulesAdmin from "@/admin/RulesAdmin";
import ChampionsAdmin from "@/admin/ChampionsAdmin";
import ScoringAdmin from "@/admin/ScoringAdmin";
import GameDayAdmin from "@/admin/GameDayAdmin";
import CourseAdmin from "@/admin/CourseAdmin";

const PAGE_TITLES = [
  [/^\/leaderboard/, "Live Leaderboard — Dalleo Open"],
  [/^\/champions/, "Champions — Dalleo Open"],
  [/^\/score/, "Captain Scoring — Dalleo Open"],
  [/^\/course/, "The Course — Dalleo Open"],
  [/^\/teams/, "Teams — Dalleo Open"],
  [/^\/schedule/, "Tournament Schedule — Dalleo Open"],
  [/^\/gallery/, "Gallery — Dalleo Open"],
  [/^\/brandon/, "In Memory of Brandon Dalleo — Dalleo Open"],
  [/^\/rules/, "Rules & Format — Dalleo Open"],
  [/^\/draft/, "2026 Draft — Dalleo Open"],
  [/^\/committee/, "Committee & Leadership — Dalleo Open"],
  [/^\/admin/, "Organizer — Dalleo Open"],
];

const Shell = () => {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith("/admin");

  useLenis(!isAdmin);

  useEffect(() => {
    const match = PAGE_TITLES.find(([pattern]) => pattern.test(pathname));
    document.title = match ? match[1] : "Dalleo Open Digital Clubhouse";
  }, [pathname]);

  return (
    <>
      <ScrollToTop />
      {!isAdmin && <Navbar />}
      {!isAdmin && <div aria-hidden="true" className="grain-overlay" />}
      <main id="main-content">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/champions" element={<Champions />} />
          <Route path="/champions/:year" element={<ChampionDetail />} />
          <Route path="/score" element={<CaptainScoring />} />
          <Route path="/course" element={<Course />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/teams/:teamId" element={<TeamDetail />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/brandon" element={<Brandon />} />
          <Route path="/rules" element={<Rules />} />
          <Route path="/draft" element={<Draft />} />
          <Route path="/committee" element={<Committee />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="announcements" element={<AnnouncementsAdmin />} />
            <Route path="teams" element={<TeamsAdmin />} />
            <Route path="schedule" element={<ScheduleAdmin />} />
            <Route path="gallery" element={<GalleryAdmin />} />
            <Route path="content" element={<ContentAdmin />} />
            <Route path="rules" element={<RulesAdmin />} />
            <Route path="champions" element={<ChampionsAdmin />} />
            <Route path="scoring" element={<ScoringAdmin />} />
            <Route path="gameday" element={<GameDayAdmin />} />
            <Route path="course" element={<CourseAdmin />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </motion.div>
      </main>
      {!isAdmin && <Footer />}
    </>
  );
};

function App() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="App">
        <BrowserRouter>
          <Shell />
        </BrowserRouter>
      </div>
    </MotionConfig>
  );
}

export default App;
