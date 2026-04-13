import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "aos/dist/aos.css";
import "./App.css";

// Import components
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import HomePage from "./pages/HomePage";
import CodeOfConductPage from "./pages/CodeOfConductPage";
import FullGalleryPage from "./pages/FullGalleryPage";

// Import AOS for animations
import AOS from "aos";
import HomePage2025 from "./pages/homepage2025";
import EventRegistrationPage from "./pages/EventRegistrationPage";
import ItProAdminPage from "./pages/ItProAdminPage";
import ItProAttendancePage from "./pages/ItProAttendancePage";
import AttendanceConfirmationPage from "./pages/AttendanceConfirmationPage";

// ScrollToTop component to handle anchor links
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // If there is a hash, find the element and scroll into view
    if (hash) {
      // Slight delay to ensure DOM is ready
      setTimeout(() => {
        const element = document.getElementById(hash.substring(1));
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      // If no hash, scroll to top
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
};

// FooterWrapper component to conditionally render Footer
const HeaderWrapper = () => {
  const location = useLocation();

  if (location.pathname.startsWith("/itproadmin")) {
    return null;
  }

  return <Header />;
};

// FooterWrapper component to conditionally render Footer
const FooterWrapper = () => {
  const location = useLocation();

  // Don't render Footer on the registrations page
  if (
    location.pathname === "/registrations" ||
    location.pathname === "/registration" ||
    location.pathname === "/confirm" ||
    location.pathname.startsWith("/itproadmin")
  ) {
    return null;
  }

  return <Footer />;
};

function App() {
  useEffect(() => {
    // Initialize AOS animation library
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: true,
      mirror: false,
    });
  }, []);

  // Get the base URL from the environment or use root
  const baseUrl = process.env.PUBLIC_URL || "";

  return (
    <Router
      basename={baseUrl}
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <ScrollToTop />
      <div className="App">
        <HeaderWrapper />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/codeofconduct" element={<CodeOfConductPage />} />
          <Route path="/registration" element={<EventRegistrationPage />} />
          <Route path="/confirm" element={<AttendanceConfirmationPage />} />
          <Route path="/itproadmin" element={<ItProAdminPage />} />
          <Route path="/itproadmin/attendance" element={<ItProAttendancePage />} />
          <Route path="/gallery" element={<FullGalleryPage />} />
          <Route path="/2025" element={<HomePage2025 />} />
        </Routes>
        <FooterWrapper />
      </div>
    </Router>
  );
}

export default App;
