import React, { useState, useEffect } from "react";
import axios from "axios";

const StandardProducts = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: "", category: 1 });
  const [editProduct, setEditProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/standard-products");
      setProducts(response.data);

      console.log({ sps: response.data });
    } catch (error) {
      console.error("Error fetching products", error);
    }
  };

  const handleCreateProduct = async () => {
    try {
      await axios.post("http://localhost:5000/standard-products", newProduct);
      setNewProduct({ name: "", category: 2 });
      fetchProducts();
    } catch (error) {
      console.error("Error creating product", error);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/standard-products/${id}`);
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product", error);
    }
  };

  const handleEditProduct = async () => {
    if (!editProduct) return;
    try {
      await axios.put(`http://localhost:5000/standard-products/${editProduct._id}`, editProduct);
      setEditProduct(null);
      fetchProducts();
    } catch (error) {
      console.error("Error editing product", error);
    }
  };

  return (
    <div>
      <h2>Standard Products</h2>
      <ul>
        {products.map((product) => (
          <li key={product._id}>
            {product.name} - {product.category === 1 ? "Fruit" : "Vegetable"}
            <button onClick={() => handleDeleteProduct(product._id)}>Delete</button>
            <button onClick={() => setEditProduct(product)}>Edit</button>
          </li>
        ))}
      </ul>

      <h3>Create New Product</h3>
      <input
        type="text"
        value={newProduct.name}
        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
        placeholder="Product Name"
      />
      <select value={newProduct.category} onChange={(e) => setNewProduct({ ...newProduct, category: parseInt(e.target.value) })}>
        <option value={1}>Fruit</option>
        <option value={2}>Vegetable</option>
      </select>
      <button onClick={handleCreateProduct}>Create</button>

      {editProduct && (
        <div>
          <h3>Edit Product</h3>
          <input
            type="text"
            value={editProduct.name}
            onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
            placeholder="Product Name"
          />
          <select value={editProduct.category} onChange={(e) => setEditProduct({ ...editProduct, category: parseInt(e.target.value) })}>
            <option value={1}>Fruit</option>
            <option value={2}>Vegetable</option>
          </select>
          <button onClick={handleEditProduct}>Save</button>
        </div>
      )}
    </div>
  );
};

export default StandardProducts;
