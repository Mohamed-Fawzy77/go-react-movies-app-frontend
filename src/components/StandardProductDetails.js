import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import axios from "axios";
import { toast } from "react-toastify";
import { uploadImage } from "../http/image-upload";
import { fetchProducts, fetchStandardProduct, updateProductImage } from "../http/product";
const backendURL = process.env.REACT_APP_BACKEND_URL;
const StandardProductDetails = () => {
  const { id } = useParams(); // Extract the standard product id from the URL
  const [standardProduct, setStandardProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: "", standardProduct: id, image: "" });
  const [editProduct, setEditProduct] = useState(null);
  const newProductImageInput = useRef();
  const editExistingProductImageInputRefs = useRef([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStandardProduct(id, setStandardProduct);
    fetchProducts(id, setProducts);
  }, [id]);

  const handleAddImageForNewProduct = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const data = await uploadImage(file);
      setNewProduct({ ...newProduct, image: data.cloudinaryUrl });
    }
  };

  const handleUpdateImageForExistingProduct = async (event, productId) => {
    const file = event.target.files[0];
    if (file) {
      const data = await uploadImage(file);

      await updateProductImage(productId, data.cloudinaryUrl);

      setProducts((prevProducts) => {
        const products = prevProducts.map((product) =>
          product._id === productId ? { ...product, image: data.cloudinaryUrl } : product
        );

        toast.success("Product image updated successfully");
        return products;
      });
    }
  };
  const handleUploadClickForNewProductImage = () => {
    newProductImageInput.current.click();
  };

  const handleUploadClickForExistingProductImage = () => {
    editExistingProductImageInputRefs.current.click();
  };

  const handleAddProduct = async () => {
    try {
      await axios.post(`${backendURL}/products`, newProduct);
      setNewProduct({ name: "", standardProduct: id });
      fetchProducts(id, setProducts);
    } catch (error) {
      console.error("Error adding product", error);
    }
  };

  // const handleRemoveProduct = async (productId) => {
  //   try {
  //     await axios.delete(`${backendURL}/products/${productId}`);
  //     fetchProducts(id, setProducts);
  //   } catch (error) {
  //     console.error("Error removing product", error);
  //   }
  // };

  const handleEditProduct = async () => {
    if (!editProduct) return;
    try {
      await axios.put(`${backendURL}/products/${editProduct._id}`, editProduct);
      setEditProduct(null);
      fetchProducts(id, setProducts);
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
        {products.map((product, index) => (
          <li key={product._id}>
            <span
              onClick={() => navigate(`/products/${product._id}`)} // Navigate to product details
              style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}
            >
              <img
                className="mt-2 mr-2"
                style={{ borderRadius: "10%" }}
                height={50}
                width={50}
                src={product.image || "/placeholder.svg"}
                alt={product.name}
              />
              <span style={{ fontSize: "20px" }}>{product.name}</span>
            </span>
            {/* <button onClick={() => handleRemoveProduct(product._id)}>Remove</button>
            <button onClick={() => setEditProduct(product)}>Edit</button> */}
            <button onClick={() => editExistingProductImageInputRefs.current[index].click()}>
              Edit Image
            </button>
            <input
              // ref={editExistingProductImageInput}
              ref={(el) => (editExistingProductImageInputRefs.current[index] = el)}
              type="file"
              accept="image/*"
              onChange={(event) => handleUpdateImageForExistingProduct(event, product._id)}
              style={{ display: "none" }}
            />
          </li>
        ))}
      </ul>

      <h3>Add New Product</h3>
      {/* <CloudinaryImage /> */}
      <input
        type="text"
        value={newProduct.name}
        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
        placeholder="اسم المنتج"
        style={{ direction: "rtl" }}
      />
      {/* // add upload image button */}

      <button onClick={handleUploadClickForNewProductImage} style={{ padding: "10px", fontSize: "16px" }}>
        Upload Image
      </button>
      <input
        ref={newProductImageInput}
        id="imageInput"
        type="file"
        accept="image/*"
        onChange={handleAddImageForNewProduct}
        style={{ display: "none" }}
      />
      <button className="ml-1" onClick={handleAddProduct}>
        Add Product
      </button>
      {newProduct.image && (
        <div style={{ marginTop: "20px" }}>
          <img
            src={newProduct.image}
            alt="Uploaded Preview"
            style={{ maxWidth: "100%", maxHeight: "300px" }}
          />
        </div>
      )}

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
