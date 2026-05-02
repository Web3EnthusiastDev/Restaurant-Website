import React from "react";
import "./About.css";

import food8  from "../../assets/frontend_assets/food_8.png";

const values = [
  {
    icon: "🏅",
    title: "Unyielding Authenticity",
    desc: "No shortcuts, no compromises. Every dish is crafted exactly as it was in 1990 — faithful to the original recipe.",
  },
  {
    icon: "❤️",
    title: "Culinary Love",
    desc: "We believe cooking is an act of love. Every pot we prepare carries the warmth of generations of dedicated cooks.",
  },
  {
    icon: "👨‍👩‍👧‍👦",
    title: "Community Heart",
    desc: "Bhawalpur Foods is more than a restaurant — it is a gathering place where families share memories over great food.",
  },
];

const About = () => {
  return (
    <div className="about-page">
      {/* Hero */}
      <div className="about-hero">
        <div className="about-hero-overlay"></div>
        <div className="about-hero-content">
       
          <h1>
            Our Heritage<br />
            &amp; <span className="about-highlight">Story</span>
          </h1>
          <p>Carrying forward the legacy of Bhawalpur&apos;s culinary masterpieces, one slow-cooked pot at a time.</p>
        </div>
      </div>

      {/* Journey Section */}
      <section className="about-journey">
        <div className="journey-image">
          <img src={food8} alt="Bhawalpur Foods Journey" />
          <div className="journey-img-label">
            <strong>DELICIOUS BHAWALPUR FOODS</strong>
            
          </div>
        </div>
        <div className="journey-text">
          <h2>The Journey Since 1990</h2>
          <div className="journey-divider"></div>
          <p>
            It all started in a small kitchen in the heart of Bhawalpur, where a
            passion for authentic flavors met years of culinary tradition passed
            down through generations.
          </p>
          <p>
            For over three decades, we have remained faithful to the original
            recipes — never cutting corners, never compromising on quality. Every
            grain of rice, every whole spice, every slow-cooked piece of meat is
            a tribute to that original vision.
          </p>
          <p>
            What began as a local neighborhood favorite has grown into a beloved
            institution across the city, bringing the warmth and soul of authentic
            Bhawalpur cooking to thousands of families.
          </p>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="about-mission">
        <div className="mission-header">
          <h2>Our Mission &amp; Values</h2>
          <div className="mission-divider"></div>
          <p>The pillars that define the Bhawalpur Foods experience.</p>
        </div>
        <div className="values-grid">
          {values.map((v, i) => (
            <div key={i} className="value-card">
              <div className="value-icon">{v.icon}</div>
              <h3>{v.title}</h3>
              <p>{v.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default About;
