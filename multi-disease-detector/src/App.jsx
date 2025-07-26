import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Components/Home/Home";
import Footer from "./Components/Footer/Footer";
import Layout from "./Components/Layout/Layout";
import PredictionForm from "./Components/PredictionForm/PredictionForm";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route
          path="/predict"
          element={
            <Layout>
              <PredictionForm />
            </Layout>
          }
        />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
