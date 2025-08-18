import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Footer from "./Components/Footer/Footer";
import Layout from "./Components/Layout/Layout";
import Prediction from "./Components/PredictionForm/Prediction";
import Result from "./Components/Result/Result";
import History from "./Components/History/History";
import Home from "./Components/Home/Home";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route 
          path="/predict/:diseaseId" 
          element={<Layout><Prediction /></Layout>} 
        />
        <Route 
          path="/result/:id" 
          element={<Layout><Result /></Layout>} 
        />
        <Route 
          path="/history" 
          element={<Layout><History /></Layout>} 
        />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;