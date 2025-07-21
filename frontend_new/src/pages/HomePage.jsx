// src/pages/HomePage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import Parallax from "./Parallax";
import SEO from "../components/SEO/SEO";
import { seoConfig } from "../components/SEO/seoConfig";
import "../styles/globals.css";  // переконайтеся, що підхоплюєте стилі

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <>
      <SEO 
        title={seoConfig.home.title}
        description={seoConfig.home.description}
        keywords={seoConfig.home.keywords}
        url="https://Travel Planner.com"
      />
      <Parallax />
    </>
  );
}
