import React, { useContext, useEffect, useState } from "react";
import "./PaymentVerify.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";

const PaymentVerify = () => {
  const [searchParams] = useSearchParams();
  const { url, token, setCartItems } = useContext(StoreContext);
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const verify = async () => {
      const orderId = searchParams.get("orderId");
      if (!orderId) { setStatus("failed"); return; }

      try {
        const headers = token ? { token } : {};
        // Pass only orderId — backend re-verifies payment status directly with Stripe
        const { data } = await axios.post(`${url}/api/order/verify`, { orderId }, { headers });

        if (data.success) {
          setCartItems({});
          setStatus("success");
        } else {
          setStatus("failed");
        }
      } catch {
        setStatus("failed");
      }
    };

    verify();
  }, []);

  if (status === "loading") {
    return (
      <div className="pv-page">
        <div className="pv-box">
          <div className="pv-spinner" />
          <p className="pv-msg">Verifying your payment with Stripe…</p>
          <p className="pv-sub">Please do not close this page.</p>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="pv-page">
        <div className="pv-box">
          <div className="pv-icon pv-icon--success">✓</div>
          <h2 className="pv-title">Payment Successful!</h2>
          <p className="pv-msg">
            Your order has been confirmed and payment received.<br />
            We'll start preparing your food right away.
          </p>
          <div className="pv-btns">
            <button className="pv-btn pv-btn--primary" onClick={() => navigate("/menu")}>Order More</button>
            <button className="pv-btn pv-btn--outline" onClick={() => navigate("/")}>Back to Home</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pv-page">
      <div className="pv-box">
        <div className="pv-icon pv-icon--fail">✕</div>
        <h2 className="pv-title">Payment Not Completed</h2>
        <p className="pv-msg">
          Your payment was not completed and the order has been cancelled.<br />
          No charges were made. You can try again.
        </p>
        <div className="pv-btns">
          <button className="pv-btn pv-btn--primary" onClick={() => navigate("/place-order")}>Try Again</button>
          <button className="pv-btn pv-btn--outline" onClick={() => navigate("/")}>Back to Home</button>
        </div>
      </div>
    </div>
  );
};

export default PaymentVerify;
