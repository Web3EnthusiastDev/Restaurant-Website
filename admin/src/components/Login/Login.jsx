import React, { useContext, useEffect, useState } from "react";
import "./Login.css";
import { toast } from "react-toastify";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";

const Login = ({ url }) => {
  const navigate = useNavigate();
  const { admin, setAdmin, token, setToken } = useContext(StoreContext);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const onLogin = async (event) => {
    event.preventDefault();
    const response = await axios.post(url + "/api/user/login", data);
    if (response.data.success) {
      if (response.data.role === "admin") {
        setToken(response.data.token);
        setAdmin(true);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("admin", true);
        toast.success("Login Successfully");
        navigate("/add");
      } else {
        toast.error("You are not an admin");
      }
    } else {
      toast.error(response.data.message);
    }
  };

  const handleForgotPassword = async () => {
    if (!forgotEmail) {
      toast.error("Please enter your email address");
      return;
    }
    try {
      const response = await axios.post(url + "/api/user/forgot-password", { email: forgotEmail });
      if (response.data.success) {
        toast.success("Password reset link sent to your email!");
        setShowForgotPassword(false);
        setForgotEmail("");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handleGoogleLogin = () => {
    toast.info("Google Sign-In coming soon! Use email/password for now.");
  };

  useEffect(() => {
    if (admin && token) {
      navigate("/add");
    }
  }, []);

  // Forgot Password Form
  if (showForgotPassword) {
    return (
      <div className="login-page">
        <div className="login-popup">
          <form onSubmit={(e) => { e.preventDefault(); handleForgotPassword(); }} className="login-popup-container">
            <div className="login-popup-title">
              <h2>Reset Password</h2>
            </div>
            <p className="forgot-desc">Enter your admin email address and we'll send you a link to reset your password.</p>
            <div className="login-popup-inputs">
              <input
                name="forgotEmail"
                onChange={(e) => setForgotEmail(e.target.value)}
                value={forgotEmail}
                type="email"
                placeholder="Admin email"
                required
              />
            </div>
            <button type="submit">Send Reset Link</button>
            <p className="back-to-login">
              <span onClick={() => setShowForgotPassword(false)}>
                ← Back to Login
              </span>
            </p>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="login-popup">
        <form onSubmit={onLogin} className="login-popup-container">
          <div className="login-popup-title">
            <h2>Admin Login</h2>
          </div>

          {/* Social Login Section */}
          <div className="social-login">
            <button type="button" className="google-btn" onClick={handleGoogleLogin}>
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
          </div>

          <div className="divider">
            <span>or</span>
          </div>

          <div className="login-popup-inputs">
            <input
              name="email"
              onChange={onChangeHandler}
              value={data.email}
              type="email"
              placeholder="Admin email"
              required
            />
            <input
              name="password"
              onChange={onChangeHandler}
              value={data.password}
              type="password"
              placeholder="Password"
              required
            />
          </div>

          <div className="forgot-password">
            <span onClick={() => setShowForgotPassword(true)}>Forgot Password?</span>
          </div>

          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
