import React, { useState, useEffect } from "react";
import axios from "axios";

const StandardProductDetails = ({ standardProductId }) => {
  const [standardProduct, setStandardProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: "", standardProduct: standardProductId });
  const [editProduct, setEditProduct] = useState(null);

  useEffect(() => {
    fetchStandardProduct();
    fetchProducts();
  }, []);

  const fetchStandardProduct = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/standard-products/${standardProductId}`);
      setStandardProduct(response.data);
    } catch (error) {
      console.error("Error fetching standard product", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/products?standardProduct=${standardProductId}`);
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products", error);
    }
  };

  const handleAddProduct = async () => {
    try {
      await axios.post("http://localhost:5000/products", newProduct);
      setNewProduct({ name: "", standardProduct: standardProductId });
      fetchProducts();
    } catch (error) {
      console.error("Error adding product", error);
    }
  };

  const handleRemoveProduct = async (productId) => {
    try {
      await axios.delete(`http://localhost:5000/products/${productId}`);
      fetchProducts();
    } catch (error) {
      console.error("Error removing product", error);
    }
  };

  const handleEditProduct = async () => {
    if (!editProduct) return;
    try {
      await axios.put(`http://localhost:5000/products/${editProduct._id}`, editProduct);
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
            {product.name}
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
