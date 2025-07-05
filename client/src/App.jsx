import React from "react";
import Stars from "./components/Stars";
import PlanetScene from "./components/PlanetScene";

function App() {
  return (
    <div className="relative h-screen w-full overflow-hidden bg-gradient-to-b from-gray-900 to-gray-800">
      <Stars />
      <PlanetScene />
    </div>
  );
}

export default App;
