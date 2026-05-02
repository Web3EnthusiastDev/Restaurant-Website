import React, { useState, useEffect, useContext } from "react";
import "./Edit.css";
import { assets } from "../../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";

const CATEGORIES = [
  "Biryani", "Karahi", "BBQ", "Deals", "Bread",
  "Desserts", "Drinks", "Salad", "Rolls", "Sandwich",
  "Cake", "Pure Veg", "Pasta", "Noodles",
];

const Edit = ({ url }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, admin } = useContext(StoreContext);

  const [newImage, setNewImage]   = useState(null);
  const [currentImage, setCurrentImage] = useState("");
  const [data, setData] = useState({
    name: "", description: "", price: "", originalPrice: "", category: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!admin && !token) {
      toast.error("Please Login First");
      navigate("/");
      return;
    }
    const fetchItem = async () => {
      const res = await axios.get(`${url}/api/food/list`);
      if (res.data.success) {
        const item = res.data.data.find((f) => f._id === id);
        if (!item) { toast.error("Item not found"); navigate("/list"); return; }
        setData({ name: item.name, description: item.description, price: item.price, originalPrice: item.originalPrice || "", category: item.category });
        setCurrentImage(`${url}/images/${item.image}`);
      }
      setLoading(false);
    };
    fetchItem();
  }, []);

  const onChange = (e) => setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("id",          id);
    formData.append("name",        data.name);
    formData.append("description", data.description);
    formData.append("price",       Number(data.price));
    if (data.originalPrice) formData.append("originalPrice", Number(data.originalPrice));
    formData.append("category",    data.category);
    if (newImage) formData.append("image", newImage);

    const res = await axios.post(`${url}/api/food/update`, formData, { headers: { token } });
    if (res.data.success) {
      toast.success(res.data.message);
      navigate("/list");
    } else {
      toast.error(res.data.message);
    }
  };

  if (loading) return <div className="edit-loading">Loading item…</div>;

  const previewSrc = newImage ? URL.createObjectURL(newImage) : currentImage;

  return (
    <div className="add">
      <p>Edit Food Item</p>
      <form onSubmit={onSubmit} className="flex-col">

        {/* Image */}
        <div className="add-img-upload flex-col">
          <p>Image <span className="edit-optional">(leave unchanged to keep current)</span></p>
          <label htmlFor="image">
            <img
              src={previewSrc || assets.upload_area}
              alt="food"
              onError={(e) => { e.target.src = assets.upload_area; }}
            />
          </label>
          <input
            type="file"
            id="image"
            hidden
            onChange={(e) => setNewImage(e.target.files[0])}
          />
        </div>

        {/* Name */}
        <div className="add-product-name flex-col">
          <p>Product name</p>
          <input
            type="text"
            name="name"
            value={data.name}
            onChange={onChange}
            placeholder="Product name"
            required
          />
        </div>

        {/* Description */}
        <div className="add-product-description flex-col">
          <p>Product description</p>
          <textarea
            name="description"
            rows="6"
            value={data.description}
            onChange={onChange}
            placeholder="Write content here"
            required
          />
        </div>

        {/* Category + Price */}
        <div className="add-category-price">
          <div className="add-category flex-col">
            <p>Category</p>
            <select name="category" value={data.category} onChange={onChange} required>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="add-price flex-col">
            <p>Price (RS.)</p>
            <input
              type="number"
              name="price"
              value={data.price}
              onChange={onChange}
              placeholder="Price"
              required
            />
          </div>
        </div>

        {/* Discount / Original Price */}
        <div className="add-discount-section flex-col">
          <p className="add-discount-label">Original Price (Rs.) <span className="add-optional">— optional, enables discount badge</span></p>
          <input
            type="number"
            name="originalPrice"
            value={data.originalPrice}
            onChange={onChange}
            placeholder="e.g. 1200 (leave blank to remove discount)"
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

        <div className="edit-actions">
          <button type="submit" className="add-btn">SAVE CHANGES</button>
          <button type="button" className="edit-cancel-btn" onClick={() => navigate("/list")}>CANCEL</button>
        </div>

      </form>
    </div>
  );
};

export default Edit;
