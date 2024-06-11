import React from "react";
import '../Style/Logo.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUtensils } from '@fortawesome/free-solid-svg-icons';

const Logo = () => {
    return (
        <a className="logo" href="./">
            <FontAwesomeIcon icon={faUtensils} />
        </a>
    );
}

export default Logo;
