import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { updateStandardProductImage } from "../http/product";
import { uploadImage } from "../http/image-upload";
import { toast } from "react-toastify";
import Modal from "react-modal";
import CreateNewVendor from "./CreateVendors";
import Vendors from "./Vendors";
import StandardProductView from "./StandardProductView";
const backendURL = process.env.REACT_APP_BACKEND_URL;
const PRODUCT_CATEGORIES = {
  1: "Fruit",
  2: "Vegetable",
  3: "canned goods",
  4: "Purchase",
};

const modalStyle = {
  content: {
    direction: "rtl",
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

const StandardProducts = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: "", category: 1 });
  const [editProduct, setEditProduct] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${backendURL}/standard-products`);
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products", error);
    }
  };

  const handleCreateProduct = async () => {
    try {
      await axios.post(`${backendURL}/standard-products`, newProduct);
      setNewProduct({ name: "", category: 2 });
      fetchProducts();
    } catch (error) {
      console.error("Error creating product", error);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await axios.delete(`${backendURL}/standard-products/${id}`);
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product", error);
    }
  };

  const handleEditProduct = async () => {
    if (!editProduct) return;
    try {
      await axios.put(`${backendURL}/standard-products/${editProduct._id}`, editProduct);
      setEditProduct(null);
      fetchProducts();
    } catch (error) {
      console.error("Error editing product", error);
    }
  };

  const editImage = async (id) => {
    try {
      const response = await axios.get(`${backendURL}/standard-products/${id}`);
      setEditProduct(response.data);
    } catch (error) {
      console.error("Error fetching product", error);
    }
  };

  const purchaseProducts = products.filter((product) => product.category === 4);
  const nonePurchaseProducts = products.filter((product) => product.category !== 4);

  return (
    <div>
      <h2>Standard Products</h2>

      <h3>Create New Standard Product</h3>
      <input
        type="text"
        value={newProduct.name}
        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
        placeholder="Product Name"
      />
      <select
        value={newProduct.category}
        onChange={(e) => setNewProduct({ ...newProduct, category: parseInt(e.target.value) })}
      >
        <option value={1}>Fruit</option>
        <option value={2}>Vegetable</option>
        <option value={3}>canned goods</option>
        <option value={4}>Purchased</option>
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
          <select
            value={editProduct.category}
            onChange={(e) => setEditProduct({ ...editProduct, category: parseInt(e.target.value) })}
          >
            <option value={1}>Fruit</option>
            <option value={2}>Vegetable</option>
          </select>
          <button onClick={handleEditProduct}>Save</button>
        </div>
      )}
      <br />
      <br />
      <br />
      <ul>
        {purchaseProducts.map((product) => (
          <StandardProductView
            key={product._id}
            product={product}
            navigate={navigate}
            handleDeleteProduct={handleDeleteProduct}
            setEditProduct={setEditProduct}
            editImage={editImage}
          />
        ))}
      </ul>
      <hr />
      <ul>
        {nonePurchaseProducts.map((product) => (
          <StandardProductView
            key={product._id}
            product={product}
            navigate={navigate}
            handleDeleteProduct={handleDeleteProduct}
            setEditProduct={setEditProduct}
            editImage={editImage}
          />
        ))}
      </ul>
      <hr />
      <CreateNewVendor />
      <br />
      <br />
      <br />
      <br />
      <br />
    </div>
  );
};

export default StandardProducts;
