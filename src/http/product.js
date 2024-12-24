import axios from "axios";
const backendURL = process.env.REACT_APP_BACKEND_URL;
export const fetchStandardProduct = async (id, setStandardProduct) => {
  try {
    const response = await axios.get(`${backendURL}/standard-products/${id}`);
    setStandardProduct(response.data);
  } catch (error) {
    console.error("Error fetching standard product", error);
  }
};

export const fetchProducts = async (id, setProducts) => {
  try {
    const response = await axios.get(`${backendURL}/products?standardProduct=${id}`);
    console.log({ prods: response.data });
    setProducts(response.data);
  } catch (error) {
    console.error("Error fetching products", error);
  }
};

export const updateProductImage = async (productId, image) => {
  try {
    await axios.put(`${backendURL}/products/${productId}`, { image });
  } catch (error) {
    console.error("Error updating product image", error);
  }
};
