import React from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import "./PlanetScene.css"; // Import the CSS file

const PlanetScene = () => {
  return (
    <div className="relative h-screen w-full flex flex-col justify-center items-center overflow-hidden bg-gray-900 star-background">
      {" "}
      {/* Added star-background class */}
      {/* Text Content - Moved higher */}
      <div className="absolute text-center z-10 px-6" style={{ top: "15%" }}>
        {" "}
        {/* Adjusted top for higher placement */}
        <h1 className="text-white text-5xl font-extrabold drop-shadow-md">
          IntelliHint💡
        </h1>
        <p className="text-gray-300 text-lg mt-4 tracking-wide">
        🪄 The AI Wings for Your Coding Journey.
        </p>
      </div>
      {/* Planet */}
      <div className="planet"></div>
      {/* Orbiting Satellite */}
      <div className="satellite-orbit">
        <div className="satellite" />
      </div>
      {/* Login to explore... - Moved below planet and made clickable */}
      <div className="absolute text-center z-10 px-6" style={{ bottom: "20%" }}>
        {" "}
        {/* Adjusted bottom for lower placement */}
        <Link
          to="/login"
          className="text-blue-400 hover:underline text-lg font-semibold"
        >
          🚀 Login to explore...
        </Link>
      </div>
    </div>
  );
};

export default PlanetScene;
