import React from "react";
import "./PlanetScene.css";

const PlanetScene = () => {
  return (
    <div className="relative h-screen w-full flex flex-col justify-center items-center overflow-hidden">
      {/* Planet */}
      <div className="planet"></div>

      {/* Orbiting Satellite */}
      <div className="satellite-orbit">
        <div className="satellite" />
      </div>

      {/* Text Content */}
      <div className="absolute text-center top-1/4 z-10 px-6">
        <h1 className="text-white text-5xl font-extrabold drop-shadow-md">
          IntelliHint
        </h1>
        <p className="text-gray-300 text-lg mt-4 tracking-wide">
          🌐 The AI Wings for Your Coding Journey.
        </p>
        <p className="text-sm text-gray-400 mt-1">🚀 Coming Soon...</p>
      </div>
    </div>
  );
};

export default PlanetScene;
