import React, { useContext, useState } from "react";
import "./Menu.css";
import { StoreContext } from "../../context/StoreContext";
import FoodCard from "../../components/FoodCard/FoodCard";

const Menu = () => {
  const { food_list } = useContext(StoreContext);
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", ...new Set(food_list.map((f) => f.category))];

  const filtered =
    activeCategory === "All"
      ? food_list
      : food_list.filter((f) => f.category === activeCategory);

  return (
    <div className="menu-page">

      {/* Hero — breaks out of .app 80% constraint */}
      <div className="menu-hero">
        <div className="menu-hero-overlay" />
        <div className="menu-hero-content">
          <h1>Our Menus</h1>
        </div>
      </div>

      <div className="menu-body">

        {/* Category Filters */}
        <div className="menu-categories-wrap">
          <p className="menu-categories-label">Browse by Category</p>
          <div className="menu-categories">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`cat-btn${activeCategory === cat ? " active" : ""}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Section header */}
        {food_list.length > 0 && (
          <div className="menu-section-header">
            <h2 className="menu-section-title">
              {activeCategory === "All" ? "All Dishes" : activeCategory}
            </h2>
            <span className="menu-section-count">{filtered.length} item{filtered.length !== 1 ? "s" : ""}</span>
          </div>
        )}

        {/* Food Grid */}
        {filtered.length > 0 ? (
          <div className="menu-grid">
            {filtered.map((item) => (
              <FoodCard
                key={item._id}
                id={item._id}
                name={item.name}
                description={item.description}
                price={item.price}
                originalPrice={item.originalPrice}
                image={item.image}
              />
            ))}
          </div>
        ) : (
          <div className="menu-empty">
            <div className="menu-empty-icon">🍽️</div>
            <p>
              {food_list.length === 0
                ? "Loading menu items…"
                : "No items in this category."}
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

export default Menu;
