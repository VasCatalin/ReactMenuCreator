import React from "react";
import "../Style/Content.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhoneVolume, faEnvelope } from '@fortawesome/free-solid-svg-icons';

const Content = ({ activeItem, startAnimation }) => {
    const textAreaStyle = {
        height: '170px'
    };

  return (
    <>
      {activeItem === "Home" && (
        <div
          className={`home ${
            startAnimation === true ? "animate-out" : "animate-in"
          }`}
        >
          <h1>Create Your Own Menu</h1>
          <p>
            Design a menu that perfectly suits your taste and style. Customize
            your selections from a wide range of delicious options, including
            appetizers, main courses, desserts, and beverages. Whether you are
            planning a special event or simply enjoying a meal at home, our
            user-friendly interface makes it easy to craft the ideal menu for
            any occasion.
          </p>
          <a href="./">Start Build</a>
        </div>
      )}

      {activeItem === "Contact" && (
        <div
          className={`contact ${
            startAnimation === true ? "animate-out" : "animate-in"
          }`}
        >
          <h1>Contact</h1>
          <div className="form mb-4 mt-4">
            <div className="form-floating mb-3">
              <input
                type="text"
                className="form-control"
                id="floatingInput"
                placeholder="name"
              />
              <label htmlFor="floatingInput">Name:</label>
            </div>

            <div className="form-floating">
              <textarea
                className="form-control"
                placeholder="Leave a comment here"
                id="floatingTextarea2"
                style={textAreaStyle}
              ></textarea>
              <label htmlFor="floatingTextarea2">Message</label>
            </div>
          </div>

          <div className="controls px-5 px-md-0 mb-4">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                value=""
                id="flexCheckDefault"
              />
              <label className="form-check-label" htmlFor="flexCheckDefault">
                I declare that I am a cheerful person.
              </label>
            </div>
            <a href="./">Send message</a>
          </div>

          <div className="contact-options px-5 px-md-0">
            <a href="tel:+40784395295"><FontAwesomeIcon icon={faPhoneVolume} /><span>0784 395 295</span></a>
            <a href="mailto:vasile.catalin3@yahoo.com"><FontAwesomeIcon icon={faEnvelope} /><span>vasile.catalin3@yahoo.com</span></a>
          </div>
        </div>
      )}
    </>
  );
};

export default Content;
