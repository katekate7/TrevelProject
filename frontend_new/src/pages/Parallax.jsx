/**
 * @fileoverview Parallax component - interactive landing page with parallax scrolling effects
 * This component creates an immersive parallax scrolling experience with animated travel-themed
 * elements, GSAP animations, and responsive design for the main landing page.
 */

// src/pages/Parallax.jsx
import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import logoPink from "../images/logopink.png";

// Register GSAP ScrollTrigger plugin for scroll-based animations
gsap.registerPlugin(ScrollTrigger);

/**
 * Parallax Component
 * 
 * Main landing page with parallax scrolling effects, animated travel elements,
 * and responsive design. Features multiple sections with different scroll speeds,
 * GSAP animations, and mobile optimizations.
 * 
 * @component
 * @returns {JSX.Element} The rendered parallax landing page with animations
 * 
 * @example
 * // Used as the main public landing page
 * <Route path="/parallax" element={<Parallax />} />
 */
export default function Parallax() {
  /** React Router navigation hook for programmatic navigation */
  const navigate = useNavigate();
  
  /** @type {[number, Function]} Current scroll position for parallax calculations */
  const [scrollY, setScrollY] = useState(0);
  
  /** @type {[boolean, Function]} Mobile device detection for conditional rendering */
  const [isMobile, setIsMobile] = useState(false);
  
  // Refs for parallax elements - used for GSAP animations and scroll effects
  /** @type {React.RefObject} Reference to hero section */
  const heroRef = useRef(null);
  
  /** @type {React.RefObject} Reference to stars/background elements */
  const starsRef = useRef(null);
  
  /** @type {React.RefObject} Reference to mountain layer 1 (foreground) */
  const mountain1Ref = useRef(null);
  
  /** @type {React.RefObject} Reference to mountain layer 2 (middle) */
  const mountain2Ref = useRef(null);
  
  /** @type {React.RefObject} Reference to mountain layer 3 (background) */
  const mountain3Ref = useRef(null);
  
  /** @type {React.RefObject} Reference to clouds/planes layer */
  const cloudsRef = useRef(null);
  
  /** @type {React.RefObject} Reference to main title element */
  const titleRef = useRef(null);
  
  /** @type {React.RefObject} Reference to subtitle element */
  const subtitleRef = useRef(null);
  
  /** @type {React.RefObject} Reference to call-to-action button */
  const ctaRef = useRef(null);
  
  /** @type {React.RefObject} Reference to features section */
  const featuresRef = useRef(null);
  
  /** @type {React.RefObject} Reference to about section */
  const aboutRef = useRef(null);  /**
   * Effect hook for scroll and animation setup
   * Handles scroll event listeners, mobile detection, and GSAP animation setup
   * Includes cleanup for performance optimization
   * 
   * @async
   * @function
   */
  useEffect(() => {
    /**
     * Updates scroll position for parallax calculations
     * @function
     */
    const handleScroll = () => setScrollY(window.scrollY);
    
    /**
     * Detects mobile devices to disable resource-intensive animations
     * @function
     */
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    // Initial checks and event listeners setup
    checkMobile();
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', checkMobile);

    let ctx; // GSAP context for cleanup
    
    // GSAP Animations - only on desktop for performance
    if (!isMobile) {
      ctx = gsap.context(() => {
        // Features section staggered animation on scroll
        gsap.fromTo(".feature-card",
          { y: 100, opacity: 0 }, // Initial state: below and invisible
          {
            y: 0,                 // Final state: original position
            opacity: 1,           // Final state: fully visible
            duration: 0.8,        // Animation duration
            stagger: 0.2,         // Delay between each card animation
            scrollTrigger: {
              trigger: featuresRef.current,
              start: "top 80%",   // Start when top of section is 80% down viewport
              end: "bottom 20%",  // End when bottom is 20% from top
            }
          }
        );

        // Floating animation for planes - continuous loop
        gsap.to(cloudsRef.current, {
          y: -15,               // Move up 15px
          duration: 4,          // 4 second duration
          ease: "power2.inOut", // Smooth easing
          yoyo: true,          // Reverse animation
          repeat: -1           // Infinite repeat
        });

        // Travel items entrance animation with bounce effect
        gsap.fromTo(".travel-item",
          { scale: 0, rotation: -180, opacity: 0 }, // Start: small, rotated, invisible
          {
            scale: 1,           // End: normal size
            rotation: 0,        // End: no rotation
            opacity: 0.7,       // End: semi-transparent
            duration: 1.5,      // Animation duration
            stagger: 0.3,       // Stagger between items
            ease: "back.out(1.7)", // Bounce-back easing
            delay: 1            // Initial delay
          }
        );

        // Continuous gentle movement for background planes
        gsap.to(".plane-bg", {
          y: "+=20",            // Move down 20px
          x: "+=10",            // Move right 10px
          rotation: "+=5",      // Rotate 5 degrees
          duration: 3,          // 3 second duration
          ease: "sine.inOut",   // Smooth sine easing
          yoyo: true,          // Reverse animation
          repeat: -1,          // Infinite repeat
          stagger: 0.5         // Different timing for each plane
        });

      });
    }

    // Cleanup function to prevent memory leaks
    return () => {
      if (ctx) {
        ctx.revert(); // Clean up GSAP animations
      }
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', checkMobile);
    };
  }, [isMobile]); // Re-run when mobile state changes

  return (
    <div className="parallax-container">
      {/* Hero Section with Parallax */}
      <section ref={heroRef} className="hero-section">
        {/* Logo in top right */}
        <img 
          src={logoPink} 
          alt="Logo" 
          className="absolute top-1.5 right-1.5 w-16 h-16 md:w-20 md:h-20 z-50"
        />
        
        {/* Animated Background Elements */}
        <div 
          ref={cloudsRef}
          className="planes-layer"
          style={!isMobile ? { transform: `translateY(${scrollY * 0.3}px)` } : {}}
        >
          {!isMobile && (
            <>
              <div className="plane-bg plane-1">✈️</div>
              <div className="plane-bg plane-2">🛩️</div>
              <div className="plane-bg plane-3">✈️</div>
              <div className="travel-item passport-1">📔</div>
              <div className="travel-item notebook-1">📓</div>
              <div className="travel-item luggage-1">🧳</div>
              <div className="travel-item passport-2">📘</div>
              <div className="travel-item luggage-2">🎒</div>
              <div className="travel-item notebook-2">📝</div>
              <div className="travel-item camera-1">📷</div>
              <div className="travel-item ticket-1">🎫</div>
            </>
          )}
        </div>

        <div 
          ref={mountain3Ref}
          className="mountain-layer mountain-3"
          style={!isMobile ? { transform: `translateY(${scrollY * 0.4}px)` } : {}}
        />
        
        <div 
          ref={mountain2Ref}
          className="mountain-layer mountain-2"
          style={!isMobile ? { transform: `translateY(${scrollY * 0.6}px)` } : {}}
        />
        
        <div 
          ref={mountain1Ref}
          className="mountain-layer mountain-1"
          style={!isMobile ? { transform: `translateY(${scrollY * 0.8}px)` } : {}}
        />

        {/* Hero Content */}
        <div className="hero-content">
          <h1 ref={titleRef} className="hero-title">
            Travel<span className="gradient-text">Planner</span>
          </h1>
          <p ref={subtitleRef} className="hero-subtitle">
            Plan your perfect journey with smart route optimization, 
            curated attractions, and seamless travel management
          </p>
          <button 
            ref={ctaRef}
            className="cta-button"
            onClick={() => navigate("/start")}
          >
            Start Your Adventure
            <span className="button-arrow">→</span>
          </button>
        </div>

        {/* Scroll Indicator */}
        <div className="scroll-indicator">
          <div className="scroll-arrow"></div>
          <span>Scroll to explore</span>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="features-section">
        <div className="container">
          <h2 className="section-title">Why Choose TravelPlanner?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🗺️</div>
              <h3>Smart Route Planning</h3>
              <p>Smart route optimization that finds the best paths between your destinations with multiple transport options.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🏛️</div>
              <h3>Curated Attractions</h3>
              <p>Discover top attractions and hidden gems with data from Wikipedia and real visitor statistics.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🌤️</div>
              <h3>Weather Integration</h3>
              <p>Real-time weather updates to help you plan the perfect trip based on current conditions.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📋</div>
              <h3>Smart Packing Lists</h3>
              <p>Automated packing suggestions based on your destination, weather, and trip duration.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🗂️</div>
              <h3>Trip Management</h3>
              <p>Organize all your travel details in one place with intuitive trip management tools.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Mobile Friendly</h3>
              <p>Access your travel plans anywhere with our responsive design that works on all devices.</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section ref={aboutRef} className="about-section">
        <div className="container">
          <div className="about-content">
            <div className="about-text">
              <h2>✨ Travel Made Simple ✨</h2>
              <p>
                TravelPlanner transforms your wanderlust into extraordinary adventures. 
                Our elegant platform is designed for the modern traveler who values 
                sophistication, style, and seamless experiences.
              </p>
              <p>
                From dreaming to discovering, we curate every moment of your journey 
                so you can focus on what matters most - creating magical memories 
                and living your best life.
              </p>
              <div className="luxury-features">
                <span className="luxury-badge">💎 Premium Experience</span>
                <span className="luxury-badge">🌸 Beautiful Interface</span>
                <span className="luxury-badge">✨ Magical Planning</span>
                <span className="luxury-badge">💕 Made with Love</span>
              </div>
            </div>
            <div className="about-visual">
              <div className="plane-animation">
                <div className="plane">✈️</div>
                <div className="plane-trail"></div>
              </div>
              <div className="floating-card card-1">
                <div className="card-content">
                  <h4>💖 Dream</h4>
                  <p>Imagine your perfect getaway</p>
                </div>
              </div>
              <div className="floating-card card-2">
                <div className="card-content">
                  <h4>🌟 Plan</h4>
                  <p>Craft your luxury itinerary</p>
                </div>
              </div>
              <div className="floating-card card-3">
                <div className="card-content">
                  <h4>💫 Experience</h4>
                  <p>Live your magical journey</p>
                </div>
              </div>
              <div className="sparkles">
                <div className="sparkle sparkle-1">✨</div>
                <div className="sparkle sparkle-2">💫</div>
                <div className="sparkle sparkle-3">⭐</div>
                <div className="sparkle sparkle-4">✨</div>
                <div className="sparkle sparkle-5">💫</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="final-cta">
        <div className="container">
          <h2>Ready to Plan Your Next Adventure?</h2>
          <p>Join thousands of travelers who trust TravelPlanner for their journeys</p>
          <button 
            className="cta-button secondary"
            onClick={() => navigate("/start")}
          >
            Get Started Today
          </button>
        </div>
      </section>

      <style jsx>{`
        .parallax-container {
          overflow-x: hidden;
        }

        .hero-section {
          height: 100vh;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #7FD1F6 0%, #6C72D1 50%, #282A54 100%);
          overflow: hidden;
        }

        .planes-layer {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .plane-bg {
          position: absolute;
          font-size: 3.5rem;
          opacity: 0.8;
          filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));
          z-index: 5;
        }

        .travel-item {
          position: absolute;
          font-size: 2.5rem;
          opacity: 0.7;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
          z-index: 4;
        }

        .plane-1 {
          top: 20%;
          left: 10%;
          animation: flyAcross 25s infinite linear;
          transform: rotate(-10deg);
        }

        .plane-2 {
          top: 35%;
          right: 20%;
          animation: flyAcross 30s infinite linear reverse;
          transform: rotate(15deg);
        }

        .plane-3 {
          top: 60%;
          left: 70%;
          animation: flyAcross 35s infinite linear;
          transform: rotate(-5deg);
        }

        /* Travel Items Positioning and Animations */
        .passport-1 {
          top: 15%;
          left: 25%;
          animation: floatSlow 8s ease-in-out infinite, rotateGently 12s linear infinite;
          animation-delay: 1s;
        }

        .notebook-1 {
          top: 45%;
          left: 5%;
          animation: bounceFloat 6s ease-in-out infinite, wiggle 4s ease-in-out infinite;
          animation-delay: 2s;
        }

        .luggage-1 {
          top: 70%;
          right: 15%;
          animation: slideAcross 20s linear infinite, bobUp 3s ease-in-out infinite;
          animation-delay: 0.5s;
        }

        .passport-2 {
          top: 25%;
          right: 35%;
          animation: floatSlow 10s ease-in-out infinite reverse, rotateGently 15s linear infinite reverse;
          animation-delay: 3s;
        }

        .luggage-2 {
          top: 55%;
          left: 85%;
          animation: slideAcross 25s linear infinite reverse, bobUp 4s ease-in-out infinite;
          animation-delay: 1.5s;
        }

        .notebook-2 {
          top: 80%;
          left: 30%;
          animation: bounceFloat 7s ease-in-out infinite, wiggle 5s ease-in-out infinite reverse;
          animation-delay: 4s;
        }

        .camera-1 {
          top: 40%;
          right: 5%;
          animation: flashFloat 9s ease-in-out infinite, rotateGently 8s linear infinite;
          animation-delay: 2.5s;
        }

        .ticket-1 {
          top: 85%;
          right: 40%;
          animation: ticketDrift 15s ease-in-out infinite, flutter 3s ease-in-out infinite;
          animation-delay: 1.8s;
        }

        @keyframes flyAcross {
          from { transform: translateX(-150px) rotate(var(--rotation, 0deg)); }
          to { transform: translateX(calc(100vw + 150px)) rotate(var(--rotation, 0deg)); }
        }

        @keyframes floatSlow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-25px) rotate(5deg); }
          50% { transform: translateY(-15px) rotate(0deg); }
          75% { transform: translateY(-35px) rotate(-5deg); }
        }

        @keyframes bounceFloat {
          0%, 100% { transform: translateY(0px) scale(1); }
          25% { transform: translateY(-20px) scale(1.1); }
          50% { transform: translateY(-10px) scale(0.95); }
          75% { transform: translateY(-30px) scale(1.05); }
        }

        @keyframes slideAcross {
          0% { transform: translateX(-100px); }
          50% { transform: translateX(50px); }
          100% { transform: translateX(-100px); }
        }

        @keyframes bobUp {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }

        @keyframes rotateGently {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(3deg); }
          75% { transform: rotate(-3deg); }
        }

        @keyframes flashFloat {
          0%, 100% { 
            transform: translateY(0px) scale(1);
            opacity: 0.7;
          }
          30% { 
            transform: translateY(-20px) scale(1.2);
            opacity: 0.9;
          }
          60% { 
            transform: translateY(-10px) scale(0.9);
            opacity: 0.8;
          }
        }

        @keyframes ticketDrift {
          0%, 100% { transform: translateX(0px) translateY(0px) rotate(0deg); }
          25% { transform: translateX(30px) translateY(-15px) rotate(5deg); }
          50% { transform: translateX(-20px) translateY(-25px) rotate(-3deg); }
          75% { transform: translateX(15px) translateY(-10px) rotate(2deg); }
        }

        @keyframes flutter {
          0%, 100% { transform: skewX(0deg); }
          25% { transform: skewX(2deg); }
          50% { transform: skewX(0deg); }
          75% { transform: skewX(-2deg); }
        }

        .mountain-layer {
          position: absolute;
          bottom: 0;
          width: 100%;
          height: 300px;
        }

        .mountain-1 {
          background: linear-gradient(45deg, #2c3e50, #3498db);
          clip-path: polygon(0 100%, 25% 60%, 50% 80%, 75% 40%, 100% 70%, 100% 100%);
          z-index: 3;
        }

        .mountain-2 {
          background: linear-gradient(45deg, #34495e, #5dade2);
          clip-path: polygon(0 100%, 20% 70%, 40% 50%, 60% 65%, 80% 45%, 100% 60%, 100% 100%);
          z-index: 2;
          opacity: 0.8;
        }

        .mountain-3 {
          background: linear-gradient(45deg, #566573, #85c1e9);
          clip-path: polygon(0 100%, 30% 65%, 60% 35%, 90% 55%, 100% 100%);
          z-index: 1;
          opacity: 0.6;
        }

        .hero-content {
          text-align: center;
          z-index: 10;
          color: white;
          max-width: 800px;
          padding: 0 20px;
        }

        .hero-title {
          font-size: clamp(3rem, 8vw, 6rem);
          font-weight: 800;
          margin: 0 0 1rem 0;
          line-height: 1.1;
        }

        .gradient-text {
          background: linear-gradient(45deg, #ff6b6b, #FF9091, #48dbfb, #ff9ff3);
          background-size: 400% 400%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: gradientShift 4s ease-in-out infinite;
        }

        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .hero-subtitle {
          font-size: clamp(1.1rem, 3vw, 1.5rem);
          opacity: 0.9;
          margin: 0 0 2rem 0;
          line-height: 1.6;
        }

        .cta-button {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 1rem 2rem;
          font-size: 1.2rem;
          font-weight: 600;
          background: linear-gradient(45deg, #FF9091, #ff6b6b);
          color: white;
          border: none;
          border-radius: 50px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 10px 30px rgba(255, 144, 145, 0.3);
        }

        .cta-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 40px rgba(255, 144, 145, 0.4);
        }

        .cta-button.secondary {
          background: linear-gradient(45deg, #667eea, #764ba2);
          box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
        }

        .button-arrow {
          transition: transform 0.3s ease;
        }

        .cta-button:hover .button-arrow {
          transform: translateX(5px);
        }

        .scroll-indicator {
          position: absolute;
          bottom: 30px;
          left: 50%;
          transform: translateX(-50%);
          text-align: center;
          color: white;
          opacity: 0.7;
        }

        .scroll-arrow {
          width: 20px;
          height: 20px;
          border-right: 2px solid white;
          border-bottom: 2px solid white;
          transform: rotate(45deg);
          margin: 0 auto 10px;
          animation: bounce 2s infinite;
        }

        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0) rotate(45deg); }
          40% { transform: translateY(-10px) rotate(45deg); }
          60% { transform: translateY(-5px) rotate(45deg); }
        }

        .features-section {
          padding: 100px 0;
          background: #f8f9fa;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .section-title {
          text-align: center;
          font-size: 3rem;
          font-weight: 700;
          margin-bottom: 3rem;
          color: #2c3e50;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 2rem;
        }

        .feature-card {
          background: white;
          padding: 2rem;
          border-radius: 20px;
          text-align: center;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }

        .feature-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }

        .feature-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .feature-card h3 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: #2c3e50;
        }

        .feature-card p {
          color: #666;
          line-height: 1.6;
        }

        .about-section {
          padding: 100px 0;
          background: linear-gradient(135deg, #6C72D1 0%, #282A54 100%);
          color: white;
          position: relative;
          overflow: hidden;
        }

        .about-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="sparkle" patternUnits="userSpaceOnUse" width="20" height="20"><circle cx="5" cy="5" r="1" fill="%23ffffff" opacity="0.3"/><circle cx="15" cy="15" r="0.5" fill="%23ffffff" opacity="0.2"/></pattern></defs><rect width="100" height="100" fill="url(%23sparkle)"/></svg>');
          opacity: 0.1;
          animation: backgroundShimmer 10s ease-in-out infinite;
        }

        @keyframes backgroundShimmer {
          0%, 100% { opacity: 0.1; transform: translateX(0); }
          50% { opacity: 0.2; transform: translateX(20px); }
        }

        .about-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
          position: relative;
          z-index: 2;
        }

        .about-text h2 {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 2rem;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
        }

        .about-text p {
          font-size: 1.1rem;
          line-height: 1.8;
          margin-bottom: 1.5rem;
          opacity: 0.95;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
        }

        .luxury-features {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          margin-top: 2rem;
        }

        .luxury-badge {
          padding: 0.7rem 1.2rem;
          background: linear-gradient(45deg, rgba(255,255,255,0.2), rgba(255,255,255,0.1));
          border-radius: 30px;
          font-size: 0.9rem;
          font-weight: 500;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.2);
          box-shadow: 0 8px 32px rgba(0,0,0,0.1);
        }

        .about-visual {
          position: relative;
          height: 500px;
        }

        .plane-animation {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 100%;
          height: 100%;
        }

        .plane {
          position: absolute;
          font-size: 3rem;
          animation: flyAround 12s ease-in-out infinite;
          z-index: 10;
          filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2));
        }

        .plane-trail {
          position: absolute;
          width: 120px;
          height: 3px;
          background: linear-gradient(90deg, 
            rgba(255,255,255,0.9) 0%, 
            rgba(255,192,203,0.7) 30%,
            rgba(138,43,226,0.5) 70%,
            transparent 100%);
          border-radius: 3px;
          animation: trailFollow 12s ease-in-out infinite;
          box-shadow: 0 0 15px rgba(255,192,203,0.6);
        }

        @keyframes flyAround {
          0% { 
            top: 20%; 
            left: 10%; 
            transform: rotate(-15deg) scale(1);
          }
          15% { 
            top: 15%; 
            left: 30%; 
            transform: rotate(0deg) scale(1.1);
          }
          30% { 
            top: 30%; 
            left: 80%; 
            transform: rotate(25deg) scale(1);
          }
          45% { 
            top: 60%; 
            left: 85%; 
            transform: rotate(45deg) scale(0.9);
          }
          60% { 
            top: 80%; 
            left: 60%; 
            transform: rotate(180deg) scale(1.1);
          }
          75% { 
            top: 70%; 
            left: 15%; 
            transform: rotate(-45deg) scale(1);
          }
          90% { 
            top: 40%; 
            left: 5%; 
            transform: rotate(-30deg) scale(1.05);
          }
          100% { 
            top: 20%; 
            left: 10%; 
            transform: rotate(-15deg) scale(1);
          }
        }

        @keyframes trailFollow {
          0% { 
            top: 20%; 
            left: 5%; 
            transform: rotate(-15deg) scaleX(1);
            opacity: 0.8;
          }
          15% { 
            top: 15%; 
            left: 25%; 
            transform: rotate(0deg) scaleX(1.2);
            opacity: 0.9;
          }
          30% { 
            top: 30%; 
            left: 75%; 
            transform: rotate(25deg) scaleX(1);
            opacity: 0.7;
          }
          45% { 
            top: 60%; 
            left: 80%; 
            transform: rotate(45deg) scaleX(0.8);
            opacity: 0.8;
          }
          60% { 
            top: 80%; 
            left: 55%; 
            transform: rotate(180deg) scaleX(1.3);
            opacity: 0.9;
          }
          75% { 
            top: 70%; 
            left: 10%; 
            transform: rotate(-45deg) scaleX(1);
            opacity: 0.6;
          }
          90% { 
            top: 40%; 
            left: 0%; 
            transform: rotate(-30deg) scaleX(1.1);
            opacity: 0.8;
          }
          100% { 
            top: 20%; 
            left: 5%; 
            transform: rotate(-15deg) scaleX(1);
            opacity: 0.8;
          }
        }

        .sparkles {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .sparkle {
          position: absolute;
          font-size: 1.5rem;
          animation: sparkleFloat 4s ease-in-out infinite;
          opacity: 0.8;
        }

        .sparkle-1 {
          top: 15%;
          left: 20%;
          animation-delay: 0s;
          animation: sparkleFloat 3s ease-in-out infinite, sparkleRotate 2s linear infinite;
        }

        .sparkle-2 {
          top: 25%;
          right: 15%;
          animation-delay: 1s;
          animation: sparkleFloat 4s ease-in-out infinite, sparkleRotate 3s linear infinite reverse;
        }

        .sparkle-3 {
          bottom: 30%;
          left: 30%;
          animation-delay: 2s;
          animation: sparkleFloat 3.5s ease-in-out infinite, sparkleRotate 2.5s linear infinite;
        }

        .sparkle-4 {
          bottom: 20%;
          right: 25%;
          animation-delay: 3s;
          animation: sparkleFloat 4.5s ease-in-out infinite, sparkleRotate 2.2s linear infinite reverse;
        }

        .sparkle-5 {
          top: 40%;
          left: 60%;
          animation-delay: 1.5s;
          animation: sparkleFloat 3.8s ease-in-out infinite, sparkleRotate 2.8s linear infinite;
        }

        @keyframes sparkleFloat {
          0%, 100% { 
            transform: translateY(0px) scale(1);
            opacity: 0.8;
          }
          33% { 
            transform: translateY(-25px) scale(1.3);
            opacity: 1;
          }
          66% { 
            transform: translateY(-10px) scale(0.9);
            opacity: 0.9;
          }
        }

        @keyframes sparkleRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .floating-card {
          position: absolute;
          background: linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,0.85));
          color: #333;
          padding: 1.8rem;
          border-radius: 20px;
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
          animation: floatCard 6s ease-in-out infinite, cardGlow 4s ease-in-out infinite;
          backdrop-filter: blur(15px);
          border: 1px solid rgba(255,255,255,0.3);
        }

        .card-1 {
          top: 15%;
          left: -5%;
          animation-delay: 0s;
          background: linear-gradient(135deg, rgba(255,182,193,0.95), rgba(255,182,193,0.85));
        }

        .card-2 {
          top: 45%;
          right: -5%;
          animation-delay: 2s;
          background: linear-gradient(135deg, rgba(255,218,224,0.95), rgba(255,218,224,0.85));
        }

        .card-3 {
          bottom: 15%;
          left: 25%;
          animation-delay: 4s;
          background: linear-gradient(135deg, rgba(255,240,245,0.95), rgba(255,240,245,0.85));
        }

        @keyframes cardGlow {
          0%, 100% { 
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
          }
          50% { 
            box-shadow: 0 20px 40px rgba(138,43,226, 0.25), 0 0 30px rgba(255,192,203, 0.3);
          }
        }

        @keyframes floatCard {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        .card-content h4 {
          font-size: 1.2rem;
          margin-bottom: 0.5rem;
        }

        .final-cta {
          padding: 100px 0;
          background: #f8f9fa;
          text-align: center;
        }

        .final-cta h2 {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: #2c3e50;
        }

        .final-cta p {
          font-size: 1.2rem;
          color: #666;
          margin-bottom: 2rem;
        }

        @media (max-width: 768px) {
          .about-content {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          
          .features-grid {
            grid-template-columns: 1fr;
          }
          
          .hero-title {
            font-size: 3rem;
          }
          
          .section-title {
            font-size: 2rem;
          }

          /* Hide all emojis and animations on mobile */
          .plane-bg {
            display: none !important;
          }

          .travel-item {
            display: none !important;
          }

          .planes-layer {
            display: none !important;
          }

          /* Disable all animations on mobile */
          .floating-card {
            animation: none !important;
            transform: none !important;
          }

          .sparkle {
            animation: none !important;
            display: none !important;
          }

          .mountain-layer {
            transform: none !important;
          }

          .about-visual {
            height: auto !important;
            text-align: center !important;
          }

          .card-1, .card-2, .card-3 {
            position: static !important;
            margin: 1rem auto !important;
            display: block !important;
            max-width: 300px !important;
            transform: none !important;
            animation: none !important;
          }

          /* Ensure hero content is responsive */
          .hero-content {
            padding: 2rem 1rem !important;
            text-align: center !important;
          }

          .hero-subtitle {
            font-size: 1rem !important;
            margin: 1rem 0 !important;
          }

          .hero-button {
            margin: 1rem auto !important;
            display: block !important;
            width: auto !important;
          }
        }
      `}</style>
    </div>
  );
}
