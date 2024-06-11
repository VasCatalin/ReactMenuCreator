import React, { useState } from "react";
import "../Style/Header.css";
import Logo from "./Logo";
import Navbar from "./Navbar";
import Hero from "./Hero";
import Content from "./Content";

const Header = ({ buildStarted, stopBuild }) => {
  const [activeItem, setActiveItem] = useState("Home");
  const [startAnimation, setStartAnimation] = useState(false);

  const handleItemClick = (item) => {
    setStartAnimation(true);
    stopBuild();
    setTimeout(() => {
      setActiveItem(item);
      setStartAnimation(false);
    }, 300);
  };

  return (
    <>
      <div className="header">
        <Logo />
        <Navbar activeItem={activeItem} onItemClicked={handleItemClick} />
        {!buildStarted && (
          <Hero activeItem={activeItem} startAnimation={startAnimation} />
        )}
      </div>

      {!buildStarted && (
        <div className="content">
          <Content activeItem={activeItem} startAnimation={startAnimation} />
        </div>
      )}
    </>
  );
};

export default Header;

