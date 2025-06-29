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

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "6rem 0",
          background: "#f9fafb",
        }}
      >
        <button
          onClick={() => navigate("/start")}
          style={{
            padding: "1rem 2rem",
            fontSize: "1.25rem",
            backgroundColor: "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: "0.375rem",
            cursor: "pointer",
            boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
          }}
        >
          Заплануй свою подорож
        </button>
      </div>

      <section className="about">
        <h2>Lorem ipsum</h2>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit laborum
          ipsam corrupti asperiores magnam quos cumque animi tempore vero
          repellendus...
        </p>
      </section>
    </>
  );
}
