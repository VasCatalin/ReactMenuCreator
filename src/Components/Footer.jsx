import React from "react";
import "../Style/Footer.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHomeUser,faG } from "@fortawesome/free-solid-svg-icons";

const Footer = () => {
  return (
    <>
      <div className="footer">
        <div className="socials">
        <a className="facebook" href="./" title="facebook">
        <FontAwesomeIcon icon={faHomeUser} />
        </a>

        <a className="git" href="./" title="git">
        <FontAwesomeIcon icon={faG} />
        </a>
        </div>

        <h6>2024</h6>
      </div>
    </>
  );
};

export default Footer;
