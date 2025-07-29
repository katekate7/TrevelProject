/**
 * @fileoverview HomePage component - main landing page with parallax effects
 * This component serves as the primary entry point for the application,
 * featuring SEO optimization and a parallax scrolling interface.
 */

// src/pages/HomePage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import Parallax from "./Parallax";
import SEO from "../components/SEO/SEO";
import { seoConfig } from "../components/SEO/seoConfig";
import "../styles/globals.css";  // Import global styles

/**
 * HomePage Component
 * 
 * Main landing page that displays a parallax scrolling interface with SEO optimization.
 * This is the first page users see when visiting the application.
 * 
 * @component
 * @returns {JSX.Element} The rendered home page with SEO head tags and parallax content
 * 
 * @example
 * // Used as the main public landing page
 * <Route path="/home" element={<HomePage />} />
 */
export default function HomePage() {
  /** React Router navigation hook for programmatic navigation */
  const navigate = useNavigate();

  return (
    <>
      {/* SEO component with optimized meta tags for search engines */}
      <SEO 
        title={seoConfig.home.title}               // Page title for SEO
        description={seoConfig.home.description}   // Meta description
        keywords={seoConfig.home.keywords}         // Meta keywords
        url="https://travelplanner.com"           // Canonical URL
      />
      
      {/* Main parallax scrolling content */}
      <Parallax />
    </>
  );
}
