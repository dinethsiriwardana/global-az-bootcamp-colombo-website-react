import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "aos/dist/aos.css";
import "./App.css";

// Import components
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import HomePage from "./pages/HomePage";
import CodeOfConductPage from "./pages/CodeOfConductPage";

// Import AOS for animations
import AOS from "aos";

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
    <Router basename={baseUrl}>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/codeofconduct" element={<CodeOfConductPage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
