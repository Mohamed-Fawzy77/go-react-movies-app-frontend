import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
const backendURL = process.env.REACT_APP_BACKEND_URL;
const ProductDetails = () => {
  const { id: productId } = useParams(); // Get the product ID from URL
  const [product, setProduct] = useState(null);
  const [pricings, setPricings] = useState([]);
  const [newPricing, setNewPricing] = useState({
    units: 0,
    totalKilos: null,
    pricePerKiloOrUnit: 0,
    totalPrice: 0,
    product: productId, // Automatically set productId when creating pricing
  });
  const [editPricing, setEditPricing] = useState(null);

  useEffect(() => {
    fetchProduct();
    fetchPricings();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`${backendURL}/products/${productId}`);
      setProduct(response.data);
    } catch (error) {
      console.error("Error fetching product", error);
    }
  };

  const fetchPricings = async () => {
    try {
      const response = await axios.get(`${backendURL}/product-pricings?product=${productId}`);
      setPricings(response.data);
    } catch (error) {
      console.error("Error fetching pricings", error);
    }
  };

  const handleAddPricing = async () => {
    try {
      const response = await axios.post(`${backendURL}/product-pricings`, newPricing);
      setNewPricing({
        units: 0,
        totalKilos: null,
        pricePerKiloOrUnit: 0,
        totalPrice: 0,
        product: productId, // Keep the product ID in the new pricing
      });
      fetchPricings();
    } catch (error) {
      console.error("Error adding pricing", error);
    }
  };

  const handleRemovePricing = async (pricingId) => {
    try {
      await axios.delete(`${backendURL}/product-pricings/${pricingId}`);
      fetchPricings();
    } catch (error) {
      console.error("Error removing pricing", error);
    }
  };

  const handleEditPricing = async () => {
    if (!editPricing) return;
    try {
      await axios.put(`${backendURL}/product-pricings/${editPricing._id}`, editPricing);
      setEditPricing(null);
      fetchPricings();
    } catch (error) {
      console.error("Error editing pricing", error);
    }
  };

  return (
    <div>
      {product && (
        <div>
          <h2>{product.name}</h2>
        </div>
      )}

      <h3>Product Pricing</h3>
      <ul>
        {pricings.map((pricing) => (
          <li key={pricing._id}>
            Units: {pricing.units}, Total Kilos: {pricing.totalKilos}, Price per Kilo/Unit:{" "}
            {pricing.pricePerKiloOrUnit}, Total Price: {pricing.totalPrice}
            {/* <button onClick={() => handleRemovePricing(pricing._id)}>Remove</button>
            <button onClick={() => setEditPricing(pricing)}>Edit</button> */}
            <button
              className={"btn " + (pricing.isActive ? "btn-danger" : "btn-success")}
              // className="btn btn-sm btn-primary"
              onClick={() => {
                axios
                  .put(`${backendURL}/product-pricings/${pricing._id}`, {
                    isActive: !pricing.isActive,
                  })
                  .then(() => {
                    setPricings(
                      pricings.map((p) => {
                        if (p._id === pricing._id) {
                          p.isActive = !p.isActive;
                        }
                        return p;
                      })
                    );
                    toast.success("Pricing updated successfully");
                  })
                  .catch((err) => {
                    toast.error("couldn't update pricing");
                    console.error(err);
                  });
              }}
            >
              {pricing.isActive ? "Dashboard Deactivate" : "Dashboard Activate"}
            </button>
            <button
              className={"btn ml-2 " + (pricing.isActiveInWeb ? "btn-danger" : "btn-success")}
              // className="btn btn-sm btn-primary"
              onClick={() => {
                axios
                  .put(`${backendURL}/product-pricings/${pricing._id}`, {
                    isActiveInWeb: !pricing.isActiveInWeb,
                  })
                  .then(() => {
                    setPricings(
                      pricings.map((p) => {
                        if (p._id === pricing._id) {
                          p.isActiveInWeb = !p.isActiveInWeb;
                        }
                        return p;
                      })
                    );
                    toast.success("Pricing updated successfully");
                  })
                  .catch((err) => {
                    toast.error("couldn't update pricing");
                    console.error(err);
                  });
              }}
            >
              {pricing.isActive ? "App Deactivate" : "App Activate"}
            </button>
          </li>
        ))}
      </ul>

      <h3>Add New Pricing</h3>
      <h5>units</h5>
      <input
        type="number"
        value={newPricing.units}
        onChange={(e) => setNewPricing({ ...newPricing, units: parseInt(e.target.value) })}
        placeholder="Units"
      />
      <h5>total kilos</h5>
      <input
        type="number"
        value={newPricing.totalKilos || ""}
        onChange={(e) => setNewPricing({ ...newPricing, totalKilos: parseFloat(e.target.value) })}
        placeholder="Total Kilos"
      />
      <h5>price per kilo/unit</h5>
      <input
        type="number"
        value={newPricing.pricePerKiloOrUnit}
        onChange={(e) => setNewPricing({ ...newPricing, pricePerKiloOrUnit: parseFloat(e.target.value) })}
        placeholder="Price per Kilo/Unit"
      />
      <h5>total price</h5>
      <input
        type="number"
        value={newPricing.totalPrice}
        onChange={(e) => setNewPricing({ ...newPricing, totalPrice: parseFloat(e.target.value) })}
        placeholder="Total Price"
      />
      <button onClick={handleAddPricing}>Add Pricing</button>

      {/* {editPricing && (
        <div>
          <h3>Edit Pricing</h3>
          <input
            type="number"
            value={editPricing.units}
            onChange={(e) => setEditPricing({ ...editPricing, units: parseInt(e.target.value) })}
            placeholder="Units"
          />
          <input
            type="number"
            value={editPricing.totalKilos || ""}
            onChange={(e) => setEditPricing({ ...editPricing, totalKilos: parseFloat(e.target.value) })}
            placeholder="Total Kilos"
          />
          <input
            type="number"
            value={editPricing.pricePerKiloOrUnit}
            onChange={(e) => setEditPricing({ ...editPricing, pricePerKiloOrUnit: parseFloat(e.target.value) })}
            placeholder="Price per Kilo/Unit"
          />
          <input
            type="number"
            value={editPricing.totalPrice}
            onChange={(e) => setEditPricing({ ...editPricing, totalPrice: parseFloat(e.target.value) })}
            placeholder="Total Price"
          />
          <button onClick={handleEditPricing}>Save</button>
        </div>
      )} */}
    </div>
  );
};

export default ProductDetails;
