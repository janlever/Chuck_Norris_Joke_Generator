import React from "react";
import { NavLink } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = ({ logoText }) => {
  return (
    <nav className="navbar">
      <h1 className="logo">{logoText}</h1>
      <ul>
        <li>
          <NavLink to="/" className="navbar-link" activeclassname="active">
            Jokes
          </NavLink>
        </li>
        <li>
          <NavLink to="/about" className="navbar-link" activeclassname="active">
            About Me
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
