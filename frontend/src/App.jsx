import React, { useState } from "react";
import Navbar from "./components/Navbar/Navbar";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import Menu from "./pages/Menu/Menu";
import Locations from "./pages/Locations/Locations";
import About from "./pages/About/About";
import OrderCheckout from "./pages/OrderCheckout/OrderCheckout";
import PaymentVerify from "./pages/PaymentVerify/PaymentVerify";
import Footer from "./components/Footer/Footer";
import CartDrawer from "./components/CartDrawer/CartDrawer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const [showCart, setShowCart] = useState(false);

  return (
    <>
      <CartDrawer showCart={showCart} setShowCart={setShowCart} />
      <div className="app">
        <ToastContainer />
        <Navbar setShowCart={setShowCart} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/locations" element={<Locations />} />
          <Route path="/about" element={<About />} />
          <Route path="/place-order" element={<OrderCheckout />} />
          <Route path="/verify" element={<PaymentVerify />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
};

export default App;
