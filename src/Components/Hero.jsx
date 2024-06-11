import React from "react";
import '../Style/Hero.css';

const Hero = ({ activeItem, startAnimation }) => {
    return (
        <div className="hero">
            <div className="hero-content">
                <h1 className="hero-name mt-2">{activeItem}</h1>
                <img
                    src={`${process.env.PUBLIC_URL}/img/${activeItem}.png`}
                    alt="Plate"
                    className={`hero-img ${startAnimation === true ? "animate-out" : "animate-in"}`}
                />
            </div>
        </div>
    );
}

export default Hero;
