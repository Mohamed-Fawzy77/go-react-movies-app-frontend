import axios from "axios";
import { toast } from "react-toastify";
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

export const fetchActivePPs = async (setPPs) => {
  try {
    const url = `${backendURL}/product-pricings/web`;

    const res = await axios.get(url);
    setPPs(res.data.PPs);
  } catch (error) {
    console.error("Error fetching orders", error);
  }
};

export const updateActivePPSortIndex = async (PPId, newSortIndex) => {
  try {
    const url = `${backendURL}/product-pricings/${PPId}/sort-index`;

    await axios.patch(url, { sortIndex: parseFloat(newSortIndex) });
    toast.success("تم التعديل بنجاح");
  } catch (error) {
    toast.error("حدث خطأ في التعديل");
    console.error("Error fetching orders", error);
  }
};

export const fetchOrders = async (date, setOrders) => {
  try {
    const url = `${backendURL}/orders?deliveryDate=${date}`;

    const res = await axios.get(url);
    setOrders(res.data.orders);
  } catch (error) {
    console.error("Error fetching orders", error);
  }
};

export const updateProductImage = async (productId, image) => {
  try {
    await axios.put(`${backendURL}/products/${productId}`, { image });
  } catch (error) {
    console.error("Error updating product image", error);
  }
};

export const updateStandardProductImage = async (productId, image) => {
  try {
    await axios.put(`${backendURL}/standard-products/${productId}/image`, { image });
  } catch (error) {
    console.error("Error updating product image", error);
  }
};

export const fetchActions = async (date, setActions) => {
  try {
    const response = await axios.get(`${backendURL}/user-action?date=${date}`);
    setActions(response.data.actions);
  } catch (error) {
    console.error("Error fetching actions", error);
  }
};
