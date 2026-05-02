import React, { useState, useEffect, useContext } from "react";
import "./Add.css";
import { assets } from "../../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";

const CATEGORIES = [
  "Biryani", "Karahi", "BBQ", "Deals", "Bread",
  "Desserts", "Drinks", "Salad", "Rolls", "Sandwich",
  "Cake", "Pure Veg", "Pasta", "Noodles",
];

const Add = ({ url }) => {
  const navigate = useNavigate();
  const { token, admin } = useContext(StoreContext);
  const [image, setImage] = useState(false);
  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    category: "Biryani",
  });

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", Number(data.price));
    if (data.originalPrice) formData.append("originalPrice", Number(data.originalPrice));
    formData.append("category", data.category);
    formData.append("image", image);

    const response = await axios.post(`${url}/api/food/add`, formData, { headers: { token } });
    if (response.data.success) {
      setData({ name: "", description: "", price: "", originalPrice: "", category: "Biryani" });
      setImage(false);
      toast.success(response.data.message);
    } else {
      toast.error(response.data.message);
    }
  };

  useEffect(() => {
    if (!admin && !token) {
      toast.error("Please Login First");
      navigate("/");
    }
  }, []);

  return (
    <div className="add">
      <form onSubmit={onSubmitHandler} className="flex-col">
        <div className="add-img-upload flex-col">
          <p>Upload image</p>
          <label htmlFor="image">
            <img src={image ? URL.createObjectURL(image) : assets.upload_area} alt="" />
          </label>
          <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" hidden required />
        </div>

        <div className="add-product-name flex-col">
          <p>Product name</p>
          <input onChange={onChangeHandler} value={data.name} type="text" name="name" placeholder="Type here" required />
        </div>

        <div className="add-product-description flex-col">
          <p>Product description</p>
          <textarea onChange={onChangeHandler} value={data.description} name="description" rows="6" placeholder="Write content here" required />
        </div>

        <div className="add-category-price">
          <div className="add-category flex-col">
            <p>Product category</p>
            <select name="category" required onChange={onChangeHandler} value={data.category}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="add-price flex-col">
            <p>Price (Rs.)</p>
            <input onChange={onChangeHandler} value={data.price} type="number" name="price" placeholder="e.g. 850" required />
          </div>
        </div>

        {/* Discount / Deal section */}
        <div className="add-discount-section flex-col">
          <p className="add-discount-label">Original Price (Rs.) <span className="add-optional">— optional, enables discount badge</span></p>
          <input
            onChange={onChangeHandler}
            value={data.originalPrice}
            type="number"
            name="originalPrice"
            placeholder="e.g. 1200 (leave blank if no discount)"
          />
          {data.originalPrice && data.price && Number(data.originalPrice) > Number(data.price) && (
            <div className="add-discount-preview">
              <span className="discount-badge-preview">
                {Math.round((1 - Number(data.price) / Number(data.originalPrice)) * 100)}% OFF
              </span>
              <span className="discount-preview-text">
                Was <s>Rs. {Number(data.originalPrice).toLocaleString()}</s> → Now Rs. {Number(data.price).toLocaleString()}
              </span>
            </div>
          )}
        </div>

        <button type="submit" className="add-btn">ADD</button>
      </form>
    </div>
  );
};

export default Add;
