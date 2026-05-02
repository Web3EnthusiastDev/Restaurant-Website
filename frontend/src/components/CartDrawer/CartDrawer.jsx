import React, { useContext } from "react";
import "./CartDrawer.css";
import { StoreContext } from "../../context/StoreContext";
import { assets } from "../../assets/frontend_assets/assets";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const CartDrawer = ({ showCart, setShowCart }) => {
  const { food_list, cartItems, addToCart, removeFromCart, setCartItems, getTotalCartAmount, url } =
    useContext(StoreContext);

  const navigate = useNavigate();
  const cartFoodItems = food_list.filter((item) => cartItems[item._id] > 0);
  const total = getTotalCartAmount();

  const handleClearCart = () => {
    setCartItems({});
    toast.info("Cart cleared");
  };

  const handlePlaceOrder = () => {
    if (total === 0) return;
    setShowCart(false);
    navigate("/place-order");
  };

  if (!showCart) return null;

  return (
    <>
      <div className="cart-overlay" onClick={() => setShowCart(false)} />
      <div className="cart-sidebar">
        {/* Header */}
        <div className="cart-sidebar-header">
          <div className="cart-sidebar-title">
            <img src={assets.basket_icon} alt="" />
            <h3>Your Order</h3>
          </div>
          <button className="cart-close-btn" onClick={() => setShowCart(false)}>
            ✕
          </button>
        </div>

        {/* Items */}
        <div className="cart-sidebar-items">
          {cartFoodItems.length === 0 ? (
            <div className="cart-empty">
              <p>Your cart is empty</p>
              <span>Add items from the menu</span>
            </div>
          ) : (
            cartFoodItems.map((item) => (
              <div key={item._id} className="cart-sidebar-item">
                <img
                  src={url + "/images/" + item.image}
                  alt={item.name}
                  className="cart-item-img"
                />
                <div className="cart-item-details">
                  <p className="cart-item-name">{item.name}</p>
                  <p className="cart-item-price">RS. {item.price}</p>
                </div>
                <div className="cart-item-counter">
                  <button onClick={() => removeFromCart(item._id)}>−</button>
                  <span>{cartItems[item._id]}</span>
                  <button onClick={() => addToCart(item._id)}>+</button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cartFoodItems.length > 0 && (
          <div className="cart-sidebar-footer">
            <div className="cart-total-row">
              <span>Total</span>
              <span className="cart-total-amount">RS. {total.toLocaleString()}</span>
            </div>
            <button className="cart-place-order-btn" onClick={handlePlaceOrder}>
              Place Order
            </button>
            <button className="cart-clear-btn" onClick={handleClearCart}>
              Clear Cart
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
