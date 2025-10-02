import React from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import ModDetails from "./components/ModDetails";
import Header from "./components/Header";

function App() {
  return (
    <div className="App min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/mod/:modId" element={<ModDetails />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
