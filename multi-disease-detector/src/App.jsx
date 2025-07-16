import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Navbar from "./Components/Navbar/Navbar";
import Sidebar from "./Components/Sidebar/Sidebar";
import Home from "./Pages/Home/Home";

// Page Components
// import PredictPage from "./Pages/PredictPage";
// import NotFound from "./Pages/NotFound"; // optional 404 fallback

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app">
      <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="main">
        <Sidebar open={sidebarOpen} closeSidebar={() => setSidebarOpen(false)} />
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            {/* <Route path="/predict/:disease" element={<PredictPage />} />
            <Route path="*" element={<NotFound />} /> */}
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
