import React from "react";
import '../Style/Navbar.css';

const Navbar = ({ activeItem, onItemClicked }) => {
    const navItems = ["Home","Contact"];

    return (
        <ul className="navbar">
            {navItems.map((item, index) => (
                <li
                    key={index}
                    className={item === activeItem ? "active" : ""}
                    onClick={() => onItemClicked(item)}
                >
                    {item}
                </li>
            ))}
        </ul>
    );
};

export default Navbar;
