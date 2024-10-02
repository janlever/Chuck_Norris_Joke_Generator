import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import JokesPage from "./features/jokes/JokesPage";
import AboutPage from "./pages/AboutPage";
import Navbar from "./components/Navbar";
import "./styles/App.css";

function App() {
  return (
    <Router>
      <Navbar logoText="Chuck Norris Joke Generator" />
      <Routes>
        <Route path="/" element={<JokesPage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </Router>
  );
}

export default App;
