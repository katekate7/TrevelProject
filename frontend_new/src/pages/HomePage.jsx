// src/pages/HomePage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import Parallax from "./Parallax";
import "../styles/globals.css";  // переконайтеся, що підхоплюєте стилі

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <>
      <Parallax />
    </>
  );
}
