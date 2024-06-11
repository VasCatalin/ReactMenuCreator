import { useState } from "react";
import "./App.css";
import Footer from "./Components/Footer";
import Header from "./Components/Header";
import ProductTile from "./Components/ProductTile";
import Builder from "./Components/Builder";

function App() {
  const [buildStarted, setBuildStarted] = useState(false);

  const startBuild = () => {
    setBuildStarted(!buildStarted);
    console.log("Build started:", buildStarted);
  };

  const stopBuild = () => {
    setBuildStarted(false);
    console.log("Build started:", buildStarted);
  };

  return (
    <div className="container">
      <Header buildStarted={buildStarted} stopBuild={stopBuild} />

      {!buildStarted && (
        <div className="product-tiles mt-5 row pt-5 pt-lg-0">
          <ProductTile startBuild={startBuild} />
        </div>
      )}

      {buildStarted && (
        <div className="builder col-12">
          <Builder></Builder>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default App;
