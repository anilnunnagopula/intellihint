import React from "react";
import "./Stars.css";

const Stars = () => {
  const stars = Array.from({ length: 150 }, (_, index) => {
    // Increased number of stars
    const top = Math.random() * 100;
    const left = Math.random() * 100;
    const size = Math.random() * 2 + 1; // 1px to 3px
    const animationDelay = Math.random() * 10; // Random delay for twinkling
    const animationDuration = Math.random() * 5 + 5; // Random duration for movement (5s to 10s)

    return (
      <div
        key={index}
        className="star"
        style={{
          top: `${top}%`,
          left: `${left}%`,
          width: `${size}px`,
          height: `${size}px`,
          animationDelay: `${animationDelay}s`,
          animationDuration: `${animationDuration}s, 2s`, // Combined for movement and twinkle
        }}
      />
    );
  });

  return <div className="stars">{stars}</div>;
};

export default Stars;
