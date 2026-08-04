import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ScrollToTop } from "@/components/ScrollToTop";
import Home from "@/pages/Home";
import Leaderboard from "@/pages/Leaderboard";
import Teams from "@/pages/Teams";
import TeamDetail from "@/pages/TeamDetail";
import Schedule from "@/pages/Schedule";
import {
  Gallery,
  Brandon,
  Rules,
} from "@/pages/placeholders";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <ScrollToTop />
        <Navbar />
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
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
