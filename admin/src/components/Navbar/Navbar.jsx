import React, { useContext, useRef } from "react";
import "./Navbar.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";
import { toast } from "react-toastify";
import {useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate=useNavigate();
  const {token, admin, setAdmin, setToken } = useContext(StoreContext);
  const profileRef=useRef(null);
  
  const handleProfileClick=()=>{
    profileRef.current.click();
  }
  
  const handleImageChange=async(event)=>{
    const file=event.target.files[0];
    if(file){
      // Create a URL for the selected image
      const imageUrl=URL.createObjectURL(file);
      // Store in localStorage for persistence
      localStorage.setItem("adminProfileImage", imageUrl);
      toast.success("Profile image updated!");
      // Force re-render by refreshing
      window.location.reload();
    }
  }
  
  const logout=()=>{
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
    setToken("");
    setAdmin(false);
    toast.success("Logout Successfully")
    navigate("/");
  }
  return (
    <div className="navbar">
      <img className="logo" src={assets.logo} alt="" />
      {token && admin ? (
        <p className="login-conditon" onClick={logout}>Add a New Item</p>
      ) : (
        <p className="login-conditon" onClick={()=>navigate("/")}>Admin Panel</p>
      )}
      <input 
        type="file" 
        ref={profileRef} 
        onChange={handleImageChange} 
        accept="image/*" 
        style={{display:'none'}}
      />
      <img 
        className="profile" 
        src={localStorage.getItem("adminProfileImage") || assets.profile_image} 
        alt="" 
        onClick={handleProfileClick}
        style={{cursor:'pointer'}}
        title="Click to change profile image"
      />
    </div>
  );
};

export default Navbar;
