import React from "react";
import "./Locations.css";

const branches = [
  {
    name: "Bhawalpur City",
    phone: "0300-1234567",
    address: "Bhawalpur, Pakistan",
    map: "https://maps.google.com/?q=Bahawalpur,Pakistan",
  },
  {
    name: "Civil Lines",
    phone: "0301-2345678",
    address: "Bhawalpur, Pakistan",
    map: "https://maps.google.com/?q=Civil+Lines+Bahawalpur",
  },
  {
    name: "Model Town",
    phone: "0302-3456789",
    address: "Bhawalpur, Pakistan",
    map: "https://maps.google.com/?q=Model+Town+Bahawalpur",
  },
  {
    name: "Satellite Town",
    phone: "0303-4567890",
    address: "Bhawalpur, Pakistan",
    map: "https://maps.google.com/?q=Satellite+Town+Bahawalpur",
  },
  {
    name: "Farid Gate",
    phone: "0304-5678901",
    address: "Bhawalpur, Pakistan",
    map: "https://maps.google.com/?q=Farid+Gate+Bahawalpur",
  },
  {
    name: "Shahi Bazar",
    phone: "0305-6789012",
    address: "Bhawalpur, Pakistan",
    map: "https://maps.google.com/?q=Shahi+Bazar+Bahawalpur",
  },
  {
    name: "Hasilpur Road",
    phone: "0306-7890123",
    address: "Bhawalpur, Pakistan",
    map: "https://maps.google.com/?q=Hasilpur+Road+Bahawalpur",
  },
];

const Locations = () => {
  return (
    <div className="locations-page">
      {/* Hero */}
      <div className="locations-hero">
        <div className="locations-hero-overlay"></div>
        <div className="locations-hero-content">
          <h1>Our Locations</h1>
          <p>Visit your nearest Bhawalpur Foods branch and enjoy authentic flavors of Old Bhawalpur.</p>
        </div>
      </div>

      {/* Branches Grid */}
      <section className="locations-body">
        <div className="branches-grid">
          {branches.map((branch, i) => (
            <div key={i} className="branch-card">
              <div className="branch-img-placeholder"></div>
              <div className="branch-info">
                <h3>{branch.name}</h3>
                <p className="branch-phone">
                  <span className="branch-icon">📞</span>
                  {branch.phone}
                </p>
                <p className="branch-address">
                  <span className="branch-icon">📍</span>
                  {branch.address}
                </p>
                <a href={branch.map} target="_blank" rel="noopener noreferrer">
                  <button className="directions-btn">Get Directions</button>
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Locations;
