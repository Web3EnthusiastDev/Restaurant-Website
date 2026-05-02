import React, { useState, useContext } from "react";
import "./OrderCheckout.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const BRANCHES = [
  { name: "Bhawalpur City",  phone: "03001234567" },
  { name: "Civil Lines",     phone: "03012345678" },
  { name: "Model Town",      phone: "03023456789" },
  { name: "Satellite Town",  phone: "03034567890" },
  { name: "Farid Gate",      phone: "03045678901" },
  { name: "Shahi Bazar",     phone: "03056789012" },
  { name: "Hasilpur Road",   phone: "03067890123" },
];

const DELIVERY_FEE  = 200;
const MAIN_PHONE    = "03001234567";
const MAIN_WA       = "923001234567";

const OrderCheckout = () => {
  const { food_list, cartItems, getTotalCartAmount, setCartItems, url, token } = useContext(StoreContext);
  const navigate = useNavigate();

  const cartFoodItems = food_list.filter((item) => cartItems[item._id] > 0);
  const subtotal      = getTotalCartAmount();

  const [name,          setName]          = useState("");
  const [phone,         setPhone]         = useState("");
  const [orderType,     setOrderType]     = useState("Delivery");
  const [branch,        setBranch]        = useState("");
  const [address,       setAddress]       = useState("");
  const [paymentMethod, setPaymentMethod] = useState("whatsapp");
  const [loading,       setLoading]       = useState(false);

  const deliveryFee = orderType === "Delivery" ? DELIVERY_FEE : 0;
  const grandTotal  = subtotal + deliveryFee;

  const validate = () => {
    if (!name.trim())   { toast.error("Please enter your name");           return false; }
    if (!phone.trim())  { toast.error("Please enter your phone number");   return false; }
    if (!branch)        { toast.error("Please select a branch");           return false; }
    if (orderType === "Delivery" && !address.trim()) {
      toast.error("Please enter your delivery address"); return false;
    }
    if (cartFoodItems.length === 0) { toast.error("Your cart is empty");   return false; }
    return true;
  };

  const buildOrderText = () =>
    cartFoodItems
      .map((item) => `• ${item.name} x${cartItems[item._id]}  —  RS.${item.price * cartItems[item._id]}`)
      .join("\n");

  const handleWhatsApp = () => {
    if (!validate()) return;
    const selected = BRANCHES.find((b) => b.name === branch);
    const waNumber = selected ? "92" + selected.phone.replace(/^0/, "") : MAIN_WA;
    const lines = [
      `🍽️ *New Order — Bhawalpur Foods*`,
      ``,
      `👤 Name: ${name}`,
      `📞 Phone: ${phone}`,
      `🚚 Order Type: ${orderType}`,
      `🏪 Branch: ${branch}`,
      ``,
      `📋 *Order Details:*`,
      buildOrderText(),
    ];
    if (orderType === "Delivery") {
      lines.push(`📍 Address: ${address}`);
      lines.push(`🚚 Delivery Fee: RS.${DELIVERY_FEE}`);
    }
    lines.push(``, `💰 *Total: RS.${grandTotal.toLocaleString()}*`);
    window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(lines.join("\n"))}`, "_blank");
    setCartItems({});
    navigate("/");
  };

  const handleOnlinePayment = async () => {
    if (!validate()) return;
    setLoading(true);
    const items = cartFoodItems.map((item) => ({
      name:     item.name,
      price:    item.price,
      quantity: cartItems[item._id],
    }));
    const orderData = {
      items,
      amount:      grandTotal,
      deliveryFee,
      address: { name, phone, orderType, branch, deliveryAddress: address },
    };
    try {
      const headers = token ? { token } : {};
      const { data } = await axios.post(`${url}/api/order/stripe`, orderData, { headers });
      if (data.success) {
        window.location.href = data.session_url;
      } else {
        toast.error(data.message || "Could not start payment");
        setLoading(false);
      }
    } catch {
      toast.error("Payment service unavailable. Please try WhatsApp order.");
      setLoading(false);
    }
  };

  return (
    <div className="po-page">
      <div className="po-container">

        {/* Hero */}
        <div className="po-hero-text">
          <h1>Order Fresh<br /><span className="po-highlight">Biryani</span> Today</h1>
          <p className="po-subtitle">Bahawalpur Foods — desi flavours, delivered to your door.</p>
        </div>

        {/* Quick contact */}
        <p className="po-direct-label">PREFER TO REACH US DIRECTLY?</p>
        <div className="po-direct-btns">
          <a href={`tel:+92${MAIN_PHONE.replace(/^0/, "")}`} className="po-direct-btn">
            <span>📞</span> Call Us
          </a>
          <a href={`https://wa.me/${MAIN_WA}`} target="_blank" rel="noopener noreferrer" className="po-direct-btn po-direct-btn--wa">
            <span>💬</span> WhatsApp Chat
          </a>
        </div>

        {/* Form card */}
        <div className="po-card">

          {/* Name */}
          <div className="po-field">
            <label>YOUR NAME <span className="po-required">*</span></label>
            <div className="po-input-wrap">
              <span className="po-icon">👤</span>
              <input type="text" placeholder="e.g. Ahmed Khan" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
          </div>

          {/* Phone + Order Type */}
          <div className="po-row">
            <div className="po-field">
              <label>PHONE NUMBER <span className="po-required">*</span></label>
              <div className="po-input-wrap">
                <span className="po-icon">📞</span>
                <input type="tel" placeholder="03XX-XXXXXXX" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
            </div>
            <div className="po-field">
              <label>ORDER TYPE</label>
              <div className="po-input-wrap">
                <span className="po-icon">🛵</span>
                <select value={orderType} onChange={(e) => setOrderType(e.target.value)}>
                  <option>Delivery</option>
                  <option>Pickup</option>
                </select>
              </div>
            </div>
          </div>

          {/* Branch */}
          <div className="po-field">
            <label>BRANCH NEAR YOU <span className="po-required">*</span></label>
            <div className="po-input-wrap">
              <span className="po-icon">🏪</span>
              <select value={branch} onChange={(e) => setBranch(e.target.value)}>
                <option value="">-- Select Nearest Branch --</option>
                {BRANCHES.map((b) => (
                  <option key={b.name} value={b.name}>{b.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Order details */}
          <div className="po-section-divider">ORDER DETAILS</div>
          {cartFoodItems.length === 0 ? (
            <p className="po-empty-cart">🛒 Your cart is empty. <a href="/menu">Browse the menu</a></p>
          ) : (
            <textarea
              className="po-details-textarea"
              readOnly
              value={buildOrderText()}
              rows={Math.max(3, cartFoodItems.length + 1)}
            />
          )}

          {/* Delivery address */}
          {orderType === "Delivery" && (
            <div className="po-field">
              <label>DELIVERY ADDRESS <span className="po-required">*</span></label>
              <div className="po-input-wrap">
                <span className="po-icon">📍</span>
                <input type="text" placeholder="Street, Area, Bahawalpur" value={address} onChange={(e) => setAddress(e.target.value)} />
              </div>
            </div>
          )}

          {/* Order total summary */}
          {cartFoodItems.length > 0 && (
            <div className="po-summary">
              <div className="po-summary-row">
                <span>Subtotal</span>
                <span>RS. {subtotal.toLocaleString()}</span>
              </div>
              {orderType === "Delivery" && (
                <div className="po-summary-row">
                  <span>Delivery Fee</span>
                  <span>RS. {DELIVERY_FEE.toLocaleString()}</span>
                </div>
              )}
              <div className="po-summary-row po-summary-total">
                <span>Total</span>
                <span>RS. {grandTotal.toLocaleString()}</span>
              </div>
            </div>
          )}

          {/* Payment method */}
          <div className="po-section-divider">HOW WOULD YOU LIKE TO PAY?</div>
          <div className="po-payment-toggle">
            <button
              className={`po-pay-opt${paymentMethod === "whatsapp" ? " active" : ""}`}
              onClick={() => setPaymentMethod("whatsapp")}
              type="button"
            >
              <span>💬</span> WhatsApp Order
            </button>
            <button
              className={`po-pay-opt${paymentMethod === "online" ? " active" : ""}`}
              onClick={() => setPaymentMethod("online")}
              type="button"
            >
              <span>💳</span> Pay Online
            </button>
          </div>

          {paymentMethod === "whatsapp" ? (
            <>
              <button className="po-send-btn" onClick={handleWhatsApp}>
                <span>💬</span> Send Order on WhatsApp
              </button>
              <p className="po-send-note">
                This will open WhatsApp with your order pre-filled.<br />
                <strong>Just press Send to confirm your order.</strong>
              </p>
            </>
          ) : (
            <>
              <button className="po-send-btn po-send-btn--pay" onClick={handleOnlinePayment} disabled={loading}>
                {loading ? <span className="po-btn-spinner" /> : <span>💳</span>}
                {loading ? "Redirecting to Stripe…" : `Pay RS. ${grandTotal.toLocaleString()} Securely`}
              </button>
              <p className="po-send-note">
                You'll be taken to a secure Stripe checkout page.<br />
                <strong>Your order is confirmed once payment completes.</strong>
              </p>
              <div className="po-stripe-badge">
                <span>🔒</span> Secured by Stripe
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
};

export default OrderCheckout;
