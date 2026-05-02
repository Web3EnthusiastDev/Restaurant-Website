import React, { useContext } from "react";
import "./Home.css";
import HomeHero from "../../components/HomeHero/HomeHero";
import { StoreContext } from "../../context/StoreContext";
import { Link } from "react-router-dom";

import food1 from "../../assets/frontend_assets/food_1.png";
import food2 from "../../assets/frontend_assets/food_2.png";
import food3 from "../../assets/frontend_assets/food_3.png";
import food4 from "../../assets/frontend_assets/food_4.png";
import food5 from "../../assets/frontend_assets/food_5.png";
import food6 from "../../assets/frontend_assets/food_6.png";
import food7 from "../../assets/frontend_assets/food_7.png";

const specialDeal = {
  image: food1,
  name: "Bhawalpur Special Deal",
  items: [
    "1 Full Chicken Karahi",
    "1 Biryani Platter",
    "5 Rogni Naan",
    "1 Full Chicken White Karahi",
    "1 Full Zarda",
    "5 Sadaa Naan",
    "3 Full Chicken Kabab",
    "2 Soft Drink 1.5L",
    "1 Fresh Salad",
    "1 Full Tikka Boti",
    "5 Sadaa Roti",
  ],
  price: 9500,
  originalPrice: 12000,
};

const legendaryDeals = [
  {
    id: "d1",
    image: food2,
    name: "4 Person Deal",
    items: ["Half Chicken Tikka", "Half Tikka Boti", "1 Full Biryani", "1.5L Soft Drink", "1 Margh", "Half Zarda"],
    price: 3100,
  },
  {
    id: "d2",
    image: food3,
    name: "Beef Special Deal",
    items: ["Half Beef Karahi", "2 Sadaa Roti", "1.5L Soft Drink", "Half Beef Kabab", "1 Fresh Salad"],
    price: 2900,
  },
  {
    id: "d3",
    image: food4,
    name: "3 Person Deal",
    items: ["2 Single Chicken Biryani", "Half Zarda", "1.5L Soft Drink", "1 Naan", "1 Tawa"],
    price: 1750,
  },
  {
    id: "d4",
    image: food5,
    name: "BBQ Platter",
    items: ["Half Chicken Biryani", "Half Tikka Boti", "2 Sadaa Naan", "3 Sadaa Roti", "Half Beef Kabab", "1.5L Soft Drink"],
    price: 3600,
  },
  {
    id: "d5",
    image: food6,
    name: "2 Person Deal",
    items: ["1 Single Chicken Biryani", "1 Half Zarda", "1 Green Tikka Boti", "5 Sadaa Naan", "2 Regular Drinks"],
    price: 1850,
  },
  {
    id: "d6",
    image: food7,
    name: "Jumbo Deal",
    items: ["1 Full Chicken Karahi", "1.5L Soft Drink", "1 Chicken Biryani", "1 Full Chicken Kabab", "4 Sadaa Roti", "1 Fresh Salad"],
    price: 5300,
  },
];

const Home = () => {
  const { addToCart, food_list, url } = useContext(StoreContext);

  const handleAddDeal = (dealName) => {
    const match = food_list.find(
      (f) => f.name.toLowerCase().includes(dealName.toLowerCase().split(" ")[0])
    );
    if (match) {
      addToCart(match._id);
    }
  };

  return (
    <div className="home">
      <HomeHero />

      {/* Special Deal */}
      <section className="special-deal-section">
        <div className="special-deal-card">
          <div className="special-deal-img-wrap">
           
            <div className="special-deal-left">
              <img src={specialDeal.image} alt={specialDeal.name} />
            </div>
          </div>
          <div className="special-deal-right">
            <h2>{specialDeal.name}</h2>
            <ul className="deal-items-list">
              {specialDeal.items.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
            <div className="deal-pricing">
              <span className="deal-price">RS.{specialDeal.price.toLocaleString()}</span>
              <span className="deal-original">RS.{specialDeal.originalPrice.toLocaleString()}</span>
            </div>
            <Link to="/menu">
              <button className="deal-add-btn">Add to Order</button>
            </Link>
          </div>
        </div>
      </section>

      {/* Legendary Deals */}
      <section className="legendary-section">
        <div className="legendary-header">
          <h2>Our Legendary Deals</h2>
          <div className="legendary-divider"></div>
          <p>Explore the flavors that made us a household name in Bhawalpur.</p>
        </div>
        <div className="deals-grid">
          {legendaryDeals.map((deal) => (
            <div key={deal.id} className="deal-card">
              <div className="deal-card-img">
                <img src={deal.image} alt={deal.name} />
              </div>
              <div className="deal-card-body">
                <h3>{deal.name}</h3>
                <ul>
                  {deal.items.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
                <div className="deal-card-footer">
                  <span className="deal-card-price">RS. {deal.price.toLocaleString()}</span>
                  <Link to="/menu">
                    <button className="deal-card-btn">Add to Cart</button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="full-menu-wrap">
          <Link to="/menu">
            <button className="full-menu-btn">Full Menu</button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
