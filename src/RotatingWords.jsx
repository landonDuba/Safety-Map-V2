// src/RotatingWords.js
import React, { useEffect, useState } from "react";
import "./RotatingWords.css";

const words = ["Safer", "Quick", "Clear"];

export default function RotatingWords() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 1500); // Change word every 1.5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <h1 className="headline">
      A Map Made to get you Home {" "}
      <span className="rotating-word">{words[index]}</span>
    </h1>
  );
}
