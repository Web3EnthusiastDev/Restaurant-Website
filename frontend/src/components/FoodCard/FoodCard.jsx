import React, { useContext, useState } from "react";
import "./FoodCard.css";
import { StoreContext } from "../../context/StoreContext";

const FoodCard = ({ id, name, price, originalPrice, description, image }) => {
  const { cartItems, addToCart, url } = useContext(StoreContext);
  const [imgError, setImgError] = useState(false);
  const qty = cartItems[id] || 0;

  const hasDiscount = originalPrice && originalPrice > price;
  const discountPct = hasDiscount
    ? Math.round((1 - price / originalPrice) * 100)
    : 0;

  return (
    <div className="food-item">
      {/* Image */}
      <div className="food-item-img-container">
        {imgError ? (
          <div className="food-item-img-fallback">&#x1F37D;&#xFE0F;</div>
        ) : (
          <img
            src={url + "/images/" + image}
            alt={name}
            className="food-item-image"
            onError={() => setImgError(true)}
          />
        )}
        {hasDiscount && (
          <span className="food-item-discount-badge">{discountPct}% OFF</span>
        )}
        {qty > 0 && (
          <span className="food-item-qty-badge">{qty} in cart</span>
        )}
      </div>

      {/* Info */}
      <div className="food-item-info">
        <p className="food-item-name">{name}</p>
        <p className="food-item-desc">{description}</p>
        <div className="food-item-price-row">
          <span className="food-item-price">Rs.{price}</span>
          {hasDiscount && (
            <span className="food-item-original-price">Rs.{originalPrice}</span>
          )}
        </div>
        <button className="add-to-cart-btn" onClick={() => addToCart(id)}>
          {qty > 0 ? `Add More  ·  ${qty} in cart` : "Add to Cart"}
        </button>
      </div>
    </div>
  );
};

export default FoodCard;
