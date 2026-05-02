import React from "react";
import "./Footer.css";
import { assets } from "../../assets/frontend_assets/assets";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer" id="footer">
      <div className="footer-content">
        {/* Left */}
        <div className="footer-content-left">
          <img src={assets.logo} alt="Bhawalpur Foods" className="footer-logo" />
          <p>
            Serving authentic Bhawalpur flavors since 1990. Our traditional dum cooking
            methods bring you the true taste of Old Bhawalpur.
          </p>
          <div className="footer-social-icons">
            <img src={assets.facebook_icon} alt="Facebook" />
            <img src={assets.twitter_icon} alt="Twitter" />
            <img src={assets.linkedin_icon} alt="LinkedIn" />
          </div>
        </div>

        {/* Center */}
        <div className="footer-content-center">
          <h2>Quick Links</h2>
          <ul>
            <li><Link to="/menu">Menu</Link></li>
            <li><Link to="/">Privacy Policy</Link></li>
            <li><Link to="/locations">Locations</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/menu">Order Online</Link></li>
          </ul>
        </div>

        {/* Right */}
        <div className="footer-content-right">
          <h2>Opening Hours</h2>
          <ul>
            <li>Mon – Thu: 10:00 AM – 3:00 AM</li>
            <li>Fri – Sat: 10:00 AM – 3:00 AM</li>
            <li>Sunday: 10:00 AM – 3:00 AM</li>
          </ul>
          <h2 style={{ marginTop: "20px" }}>Contact</h2>
          <ul>
            <li>City Branch: 0300-1234567</li>
            <li>Civil Lines: 0301-2345678</li>
            <li>Model Town: 0302-3456789</li>
          </ul>
        </div>
      </div>

      <hr />

      <p className="footer-copyright">
        &copy; 2026 Bhawalpur Foods. All Rights Reserved.
      </p>
    </footer>
  );
};

export default Footer;
