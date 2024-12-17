import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import axios from "axios";
const backendURL = process.env.REACT_APP_BACKEND_URL;
const StandardProductDetails = () => {
  const { id } = useParams(); // Extract the standard product id from the URL
  const [standardProduct, setStandardProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: "", standardProduct: id });
  const [editProduct, setEditProduct] = useState(null);
  const navigate = useNavigate(); // Use navigate for redirecting

  useEffect(() => {
    fetchStandardProduct();
    fetchProducts();
  }, [id]);

  const fetchStandardProduct = async () => {
    try {
      const response = await axios.get(`${backendURL}/standard-products/${id}`);
      setStandardProduct(response.data);
    } catch (error) {
      console.error("Error fetching standard product", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${backendURL}/products?standardProduct=${id}`);
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products", error);
    }
  };

  const handleAddProduct = async () => {
    try {
      await axios.post(`${backendURL}/products`, newProduct);
      setNewProduct({ name: "", standardProduct: id });
      fetchProducts();
    } catch (error) {
      console.error("Error adding product", error);
    }
  };

  const handleRemoveProduct = async (productId) => {
    try {
      await axios.delete(`${backendURL}/products/${productId}`);
      fetchProducts();
    } catch (error) {
      console.error("Error removing product", error);
    }
  };

  const handleEditProduct = async () => {
    if (!editProduct) return;
    try {
      await axios.put(`${backendURL}/products/${editProduct._id}`, editProduct);
      setEditProduct(null);
      fetchProducts();
    } catch (error) {
      console.error("Error editing product", error);
    }
  };

  return (
    <div>
      {standardProduct && (
        <div>
          <h2>{standardProduct.name}</h2>
          <p>Category: {standardProduct.category === 1 ? "Fruit" : "Vegetable"}</p>
        </div>
      )}

      <h3>Products</h3>
      <ul>
        {products.map((product) => (
          <li key={product._id}>
            <span
              onClick={() => navigate(`/products/${product._id}`)} // Navigate to product details
              style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}
            >
              {product.name}
            </span>
            <button onClick={() => handleRemoveProduct(product._id)}>Remove</button>
            <button onClick={() => setEditProduct(product)}>Edit</button>
          </li>
        ))}
      </ul>

      <h3>Add New Product</h3>
      <input
        type="text"
        value={newProduct.name}
        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
        placeholder="Product Name"
      />
      <button onClick={handleAddProduct}>Add</button>

      {editProduct && (
        <div>
          <h3>Edit Product</h3>
          <input
            type="text"
            value={editProduct.name}
            onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
            placeholder="Product Name"
          />
          <button onClick={handleEditProduct}>Save</button>
        </div>
      )}
    </div>
  );
};

export default StandardProductDetails;
