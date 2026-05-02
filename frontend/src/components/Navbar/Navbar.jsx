import React, { useContext, useState, useEffect, useRef } from "react";
import "./Navbar.css";
import { assets } from "../../assets/frontend_assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";

const Navbar = ({ setShowCart }) => {
  const [menu, setMenu] = useState("home");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [allFoods, setAllFoods] = useState([]);
  const searchRef = useRef(null);
  const { getTotalCartAmount, url } = useContext(StoreContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const response = await fetch(`${url}/api/food/list`);
        const data = await response.json();
        if (data.success) setAllFoods(data.data || []);
      } catch (error) {
        console.error("Error fetching foods:", error);
      }
    };
    fetchFoods();
  }, [url]);

  useEffect(() => {
    if (searchQuery.trim() === "") { setSearchResults([]); return; }
    const filtered = allFoods.filter(
      (food) =>
        food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        food.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        food.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(filtered.slice(0, 5));
  }, [searchQuery, allFoods]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearchOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMenuClick = (item) => {
    setMenu(item);
    setSidebarOpen(false);
  };

  const openCart = () => {
    setShowCart(true);
    setSidebarOpen(false);
  };

  const cartCount = getTotalCartAmount();

  return (
    <div className="navbar">
      {/* Hamburger */}
      <div
        className={`hamburger ${sidebarOpen ? "open" : ""}`}
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>

      <Link to="/" onClick={() => handleMenuClick("home")}>
        <img src={assets.logo} alt="" className="logo" />
      </Link>

      {/* Desktop nav */}
      <ul className="navbar-menu">
        <Link to="/" onClick={() => handleMenuClick("home")} className={menu === "home" ? "active" : ""}>Home</Link>
        <Link to="/menu" onClick={() => handleMenuClick("menu")} className={menu === "menu" ? "active" : ""}>Menu</Link>
        <Link to="/locations" onClick={() => handleMenuClick("locations")} className={menu === "locations" ? "active" : ""}>Locations</Link>
        <Link to="/about" onClick={() => handleMenuClick("about")} className={menu === "about" ? "active" : ""}>About</Link>
      </ul>

      <div className="navbar-right">
        {/* Search */}
        <div className="search-container" ref={searchRef}>
          <img
            src={assets.search_icon}
            alt=""
            className={`search-icon ${searchOpen ? "active" : ""}`}
            onClick={() => setSearchOpen(!searchOpen)}
          />
          {searchOpen && (
            <div className="search-dropdown">
              <input
                type="text"
                placeholder="Search for dishes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="search-input"
              />
              {searchResults.length > 0 && (
                <div className="search-results">
                  {searchResults.map((food) => (
                    <div
                      key={food._id}
                      className="search-result-item"
                      onClick={() => { setSearchOpen(false); setSearchQuery(""); navigate("/menu"); }}
                    >
                      <img src={url + "/images/" + food.image} alt="" />
                      <div className="search-result-info">
                        <p className="search-result-name">{food.name}</p>
                        <p className="search-result-category">{food.category}</p>
                      </div>
                      <span className="search-result-price">Rs. {food.price}</span>
                    </div>
                  ))}
                </div>
              )}
              {searchQuery && searchResults.length === 0 && (
                <div className="search-no-results">
                  <p>No dishes found for &quot;{searchQuery}&quot;</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Cart */}
        <div className="navbar-cart" onClick={openCart}>
          <img src={assets.basket_icon} alt="" />
          {cartCount > 0 && <span className="cart-dot"></span>}
          <span className="cart-label">Cart</span>
        </div>
      </div>

      {/* Sidebar overlay */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? "active" : ""}`}
        onClick={() => setSidebarOpen(false)}
      ></div>

      {/* Mobile sidebar */}
      <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <img src={assets.logo} alt="" className="sidebar-logo" />
          <button className="sidebar-close" onClick={() => setSidebarOpen(false)}>×</button>
        </div>

        <nav className="sidebar-nav">
          <Link to="/" onClick={() => handleMenuClick("home")} className={menu === "home" ? "active" : ""}>Home</Link>
          <Link to="/menu" onClick={() => handleMenuClick("menu")} className={menu === "menu" ? "active" : ""}>Menu</Link>
          <Link to="/locations" onClick={() => handleMenuClick("locations")} className={menu === "locations" ? "active" : ""}>Locations</Link>
          <Link to="/about" onClick={() => handleMenuClick("about")} className={menu === "about" ? "active" : ""}>About</Link>
          <a onClick={openCart} style={{ cursor: "pointer" }}>
            Cart {cartCount > 0 && <span className="cart-badge">●</span>}
          </a>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
