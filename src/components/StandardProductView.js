import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { updateStandardProductImage } from "../http/product";
import { uploadImage } from "../http/image-upload";
import { toast } from "react-toastify";
import Modal from "react-modal";
import CreateNewVendor from "./CreateVendors";
import Vendors from "./Vendors";
import CreateNewPurchase from "./CreatePurchase";
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

export default function StandardProductView({ product, handleDeleteProduct, setEditProduct, navigate }) {
  const ref = useRef();

  const [image, setImage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleUpdateImageForExistingProduct = async (event, productId) => {
    const file = event.target.files[0];
    if (file) {
      const data = await uploadImage(file);

      await updateStandardProductImage(productId, data.cloudinaryUrl);

      setImage(data.cloudinaryUrl);

      toast.success("standard product image updated successfully");
    }
  };

  return (
    <>
      <li key={product._id}>
        <img
          className="mt-2 mr-2"
          style={{ borderRadius: "10%" }}
          height={30}
          width={30}
          src={image || product.image || "/placeholder.svg"}
          alt="product"
        />
        <span
          onClick={() => product.category !== 4 && navigate(`/sps/${product._id}`)}
          style={
            product.category === 4 ? {} : { cursor: "pointer", color: "blue", textDecoration: "underline" }
          }
        >
          {product.name} - {PRODUCT_CATEGORIES[product.category]}
        </span>
        <button onClick={() => ref.current.click()}>Edit Image</button>
        <button onClick={() => setIsModalOpen(true)}>add purchase</button>
        <input
          // ref={editExistingProductImageInput}
          ref={ref}
          type="file"
          accept="image/*"
          onChange={(event) => handleUpdateImageForExistingProduct(event, product._id)}
          style={{ display: "none" }}
        />
      </li>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Example Modal"
        style={modalStyle}
      >
        <CreateNewPurchase setIsModalOpen={setIsModalOpen} standardProduct={product} />
      </Modal>
    </>
  );
}
