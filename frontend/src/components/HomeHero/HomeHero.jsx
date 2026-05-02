import React from "react";
import "./HomeHero.css";
import { Link } from "react-router-dom";

const HomeHero = () => {
  return (
    <div className="header">
      <div className="header-overlay"></div>
      <div className="header-contents">
       
        <h1>
          <br />
          <span className="header-highlight">Delicious Taste of Bahawalpur</span>
        </h1>
        <p>Biryani Point &amp; Restaurant</p>
        <Link to="/menu">
          <button className="header-btn">View Full Menu</button>
        </Link>
      </div>
    </div>
  );
};

export default HomeHero;
