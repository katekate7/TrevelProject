// src/pages/Parallax.jsx
import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Parallax() {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  
  // Refs for parallax elements
  const heroRef = useRef(null);
  const starsRef = useRef(null);
  const mountain1Ref = useRef(null);
  const mountain2Ref = useRef(null);
  const mountain3Ref = useRef(null);
  const cloudsRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const ctaRef = useRef(null);
  const featuresRef = useRef(null);
  const aboutRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);

    // GSAP Animations
    const ctx = gsap.context(() => {
      // Hero animation on load
      gsap.fromTo(titleRef.current, 
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.5, ease: "power3.out" }
      );

      gsap.fromTo(subtitleRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, delay: 0.3, ease: "power3.out" }
      );

      gsap.fromTo(ctaRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, delay: 0.6, ease: "power3.out" }
      );

      // Features section animation
      gsap.fromTo(".feature-card",
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.2,
          scrollTrigger: {
            trigger: featuresRef.current,
            start: "top 80%",
            end: "bottom 20%",
          }
        }
      );

      // About section animation
      gsap.fromTo(".about-text",
        { x: -100, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1.2,
          scrollTrigger: {
            trigger: aboutRef.current,
            start: "top 70%",
          }
        }
      );

      // Floating animation for clouds
      gsap.to(cloudsRef.current, {
        y: -20,
        duration: 3,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1
      });

      // Twinkling stars
      gsap.to(".star", {
        opacity: 0.3,
        duration: 2,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1,
        stagger: 0.5
      });

    });

    return () => {
      ctx.revert();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="parallax-container">
      {/* Hero Section with Parallax */}
      <section ref={heroRef} className="hero-section">
        {/* Animated Background Elements */}
        <div 
          ref={starsRef}
          className="stars-layer"
          style={{ transform: `translateY(${scrollY * 0.1}px)` }}
        >
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="star"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`
              }}
            />
          ))}
        </div>

        <div 
          ref={cloudsRef}
          className="clouds-layer"
          style={{ transform: `translateY(${scrollY * 0.3}px)` }}
        >
          <div className="cloud cloud-1"></div>
          <div className="cloud cloud-2"></div>
          <div className="cloud cloud-3"></div>
        </div>

        <div 
          ref={mountain3Ref}
          className="mountain-layer mountain-3"
          style={{ transform: `translateY(${scrollY * 0.4}px)` }}
        />
        
        <div 
          ref={mountain2Ref}
          className="mountain-layer mountain-2"
          style={{ transform: `translateY(${scrollY * 0.6}px)` }}
        />
        
        <div 
          ref={mountain1Ref}
          className="mountain-layer mountain-1"
          style={{ transform: `translateY(${scrollY * 0.8}px)` }}
        />

        {/* Hero Content */}
        <div className="hero-content">
          <h1 ref={titleRef} className="hero-title">
            Travel<span className="gradient-text">Planner</span>
          </h1>
          <p ref={subtitleRef} className="hero-subtitle">
            Plan your perfect journey with AI-powered recommendations, 
            route optimization, and seamless travel management
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
              <p>AI-powered route optimization that finds the best paths between your destinations with multiple transport options.</p>
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
              <h2>The Future of Travel Planning</h2>
              <p>
                TravelPlanner revolutionizes how you plan and experience your journeys. 
                Built with modern web technologies including React, Symfony, and powered by 
                OpenRouteService API, our platform combines the best of technology with 
                the joy of travel discovery.
              </p>
              <p>
                From initial planning to real-time navigation, we handle every aspect 
                of your trip so you can focus on what matters most - creating unforgettable memories.
              </p>
              <div className="tech-stack">
                <span className="tech-badge">React</span>
                <span className="tech-badge">Symfony</span>
                <span className="tech-badge">MySQL</span>
                <span className="tech-badge">OpenRouteService</span>
                <span className="tech-badge">Leaflet Maps</span>
              </div>
            </div>
            <div className="about-visual">
              <div className="floating-card card-1">
                <div className="card-content">
                  <h4>🎯 Plan</h4>
                  <p>Choose destination & dates</p>
                </div>
              </div>
              <div className="floating-card card-2">
                <div className="card-content">
                  <h4>🗺️ Explore</h4>
                  <p>Discover attractions & routes</p>
                </div>
              </div>
              <div className="floating-card card-3">
                <div className="card-content">
                  <h4>✈️ Travel</h4>
                  <p>Navigate with confidence</p>
                </div>
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
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          overflow: hidden;
        }

        .stars-layer {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 120%;
          pointer-events: none;
        }

        .star {
          position: absolute;
          width: 2px;
          height: 2px;
          background: white;
          border-radius: 50%;
          animation: twinkle 3s infinite ease-in-out;
        }

        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }

        .clouds-layer {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .cloud {
          position: absolute;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50px;
          opacity: 0.6;
        }

        .cloud-1 {
          width: 100px;
          height: 40px;
          top: 20%;
          left: 10%;
          animation: float 20s infinite linear;
        }

        .cloud-2 {
          width: 80px;
          height: 30px;
          top: 30%;
          right: 20%;
          animation: float 25s infinite linear reverse;
        }

        .cloud-3 {
          width: 120px;
          height: 50px;
          top: 40%;
          left: 70%;
          animation: float 30s infinite linear;
        }

        @keyframes float {
          from { transform: translateX(-100px); }
          to { transform: translateX(100vw); }
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
          background: linear-gradient(45deg, #ff6b6b, #feca57, #48dbfb, #ff9ff3);
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
          background: linear-gradient(45deg, #ff6b6b, #feca57);
          color: white;
          border: none;
          border-radius: 50px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 10px 30px rgba(255, 107, 107, 0.3);
        }

        .cta-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 40px rgba(255, 107, 107, 0.4);
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
          background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
          color: white;
        }

        .about-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
        }

        .about-text h2 {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 2rem;
        }

        .about-text p {
          font-size: 1.1rem;
          line-height: 1.8;
          margin-bottom: 1.5rem;
          opacity: 0.9;
        }

        .tech-stack {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          margin-top: 2rem;
        }

        .tech-badge {
          padding: 0.5rem 1rem;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 25px;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .about-visual {
          position: relative;
          height: 400px;
        }

        .floating-card {
          position: absolute;
          background: white;
          color: #2c3e50;
          padding: 1.5rem;
          border-radius: 15px;
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
          animation: floatCard 6s ease-in-out infinite;
        }

        .card-1 {
          top: 20%;
          left: 0;
          animation-delay: 0s;
        }

        .card-2 {
          top: 50%;
          right: 0;
          animation-delay: 2s;
        }

        .card-3 {
          bottom: 20%;
          left: 30%;
          animation-delay: 4s;
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
        }
      `}</style>
    </div>
  );
}
