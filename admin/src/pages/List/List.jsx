import React, { useEffect, useState } from "react";
import "./List.css";
import axios from "axios";
import { toast } from "react-toastify";
import { useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";

const List = ({ url }) => {
  const navigate = useNavigate();
  const { token, admin } = useContext(StoreContext);
  const [list, setList] = useState([]);

  const fetchList = async () => {
    const response = await axios.get(`${url}/api/food/list`);
    if (response.data.success) {
      setList(response.data.data);
    } else {
      toast.error("Error");
    }
  };

  const removeFood = async (foodId) => {
    const response = await axios.post(
      `${url}/api/food/remove`,
      { id: foodId },
      { headers: { token } }
    );
    await fetchList();
    if (response.data.success) {
      toast.success(response.data.message);
    } else {
      toast.error("Error");
    }
  };

  useEffect(() => {
    if (!admin && !token) {
      toast.error("Please Login First");
      navigate("/");
    }
    fetchList();
  }, []);

  return (
    <div className="list add flex-col">
      <p>All Food List</p>
      <div className="list-table">
        <div className="list-table-format title list-table-format--with-discount">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Discount</b>
          <b>Edit</b>
          <b>Remove</b>
        </div>
        {list.map((item, index) => {
          const hasDiscount = item.originalPrice && item.originalPrice > item.price;
          const discountPct = hasDiscount
            ? Math.round((1 - item.price / item.originalPrice) * 100)
            : 0;
          return (
            <div key={index} className="list-table-format list-table-format--with-discount">
              <img src={`${url}/images/` + item.image} alt="" />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>
                Rs.{item.price}
                {hasDiscount && (
                  <span className="list-original-price"> <s>Rs.{item.originalPrice}</s></span>
                )}
              </p>
              <p>
                {hasDiscount
                  ? <span className="list-discount-badge">{discountPct}% OFF</span>
                  : <span className="list-no-discount">—</span>}
              </p>
              <button
                className="list-edit-btn"
                onClick={() => navigate(`/edit/${item._id}`)}
              >
                Edit
              </button>
              <p onClick={() => removeFood(item._id)} className="cursor list-remove-btn">
                Remove
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default List;
