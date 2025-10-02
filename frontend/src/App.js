import React from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScreenRecorder from "./components/ScreenRecorder";
import Header from "./components/Header";

function App() {
  return (
    <div className="App min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<ScreenRecorder />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
