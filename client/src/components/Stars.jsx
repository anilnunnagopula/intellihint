// src/components/Stars.jsx
import React from "react";
import "./Stars.css";

const Stars = () => {
  const stars = Array.from({ length: 100 }, (_, index) => {
    const top = Math.random() * 100;
    const left = Math.random() * 100;
    const size = Math.random() * 2 + 1; // 1px to 3px

    return (
      <div
        key={index}
        className="star"
        style={{
          top: `${top}%`,
          left: `${left}%`,
          width: `${size}px`,
          height: `${size}px`,
        }}
      />
    );
  });

  return <div className="stars">{stars}</div>;
};

export default Stars;
