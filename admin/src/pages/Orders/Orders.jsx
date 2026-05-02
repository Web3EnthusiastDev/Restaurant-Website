import React from "react";
import "./Orders.css";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { assets } from "../../assets/assets";
import { useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";

const Orders = ({ url }) => {
  const navigate = useNavigate();
  const { token, admin } = useContext(StoreContext);
  const [orders, setOrders] = useState([]);
  const [deliveryPerson, setDeliveryPerson] = useState({});

  const fetchAllOrder = async () => {
    const response = await axios.get(url + "/api/order/list", {
      headers: { token },
    });
    if (response.data.success) {
      setOrders(response.data.data);
    }
  };

  const statusHandler = async (event, orderId) => {
    const response = await axios.post(
      url + "/api/order/status",
      {
        orderId,
        status: event.target.value,
      },
      { headers: { token } }
    );
    if (response.data.success) {
      toast.success(response.data.message);
      await fetchAllOrder();
    } else {
      toast.error(response.data.message);
    }
  };

  const assignDeliveryHandler = async (orderId) => {
    const person = deliveryPerson[orderId];
    if (!person || person.trim() === "") {
      toast.error("Please enter delivery person name");
      return;
    }
    try {
      const response = await axios.post(
        url + "/api/order/assign-delivery",
        {
          orderId,
          person: person,
        },
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success("Delivery person assigned!");
        await fetchAllOrder();
        setDeliveryPerson({ ...deliveryPerson, [orderId]: "" });
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Failed to assign delivery");
    }
  };

  useEffect(() => {
    if (!admin && !token) {
      toast.error("Please Login First");
      navigate("/");
    }
    fetchAllOrder();
  }, []);

  return (
    <div className="order add">
      <h3>Order Management</h3>
      <div className="order-list">
        {orders.length === 0 ? (
          <p className="no-orders">No orders yet</p>
        ) : (
          orders.map((order, index) => (
            <div key={index} className="order-item">
              <img src={assets.parcel_icon} alt="" />
              <div>
                <p className="order-item-food">
                  {order.items.map((item, index) => {
                    if (index === order.items.length - 1) {
                      return item.name + " x " + item.quantity;
                    } else {
                      return item.name + " x " + item.quantity + ", ";
                    }
                  })}
                </p>
                <p className="order-item-name">
                  {order.address.firstName + " " + order.address.lastName}
                </p>
                <div className="order-item-address">
                  <p>{order.address.street + ","}</p>
                  <p>
                    {order.address.city +
                      ", " +
                      order.address.state +
                      ", " +
                      order.address.country +
                      ", " +
                      order.address.zipcode}
                  </p>
                </div>
                <p className="order-item-phone">{order.address.phone}</p>
              </div>
              <div className="order-info">
                <p className="order-items-count">Items: {order.items.length}</p>
                <p className="order-amount">Rs. {order.amount}</p>
                <span className={`payment-method ${order.paymentMethod === "COD" ? "cod" : "card"}`}>
                  {order.paymentMethod === "COD" ? "💵 COD" : "💳 Card"}
                </span>
                {order.payment && (
                  <span className="payment-status paid">Paid</span>
                )}
              </div>
              <div className="order-status-section">
                <label>Order Status:</label>
                <select
                  onChange={(event) => statusHandler(event, order._id)}
                  value={order.status}
                >
                  <option value="Food Processing">Food Processing</option>
                  <option value="Out for delivery">Out for delivery</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>
              <div className="delivery-section">
                <label>Assign Delivery:</label>
                {order.delivery && order.delivery.assigned ? (
                  <div className="delivery-assigned">
                    <span>👤 {order.delivery.person}</span>
                    <span className="delivery-status">{order.delivery.status}</span>
                  </div>
                ) : (
                  <div className="delivery-input">
                    <input
                      type="text"
                      placeholder="Delivery person name"
                      value={deliveryPerson[order._id] || ""}
                      onChange={(e) =>
                        setDeliveryPerson({
                          ...deliveryPerson,
                          [order._id]: e.target.value,
                        })
                      }
                    />
                    <button onClick={() => assignDeliveryHandler(order._id)}>
                      Assign
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Orders;
