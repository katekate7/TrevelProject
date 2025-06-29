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
