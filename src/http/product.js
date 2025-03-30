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

export const updateProductSortIndex = async (productId, newSortIndex) => {
  try {
    const url = `${backendURL}/products/${productId}/sort-index`;

    await axios.patch(url, { sortIndex: parseFloat(newSortIndex) });
    toast.success("تم التعديل بنجاح");
  } catch (error) {
    toast.error("حدث خطأ في التعديل");
    console.error("Error fetching orders", error);
  }
};

export const getOrdersByPhone = async (phone, setOrders) => {
  try {
    const url = `${backendURL}/orders/user-orders/${phone}`;

    const res = await axios.get(url);
    console.log({ data: res.data });
    if (res.data.invalidUser) {
      setOrders([]);
      toast.error("المستخدم غير موجود");
      return;
    }

    setOrders(res.data.orders);
  } catch (error) {
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

export const addPurchase = async (values) => {
  try {
    let {
      standardProduct,
      vendor,
      units,
      totalKilos,
      mainFees,
      extraFees,
      paidMainFees,
      paidExtraFees,
      date,
    } = values;

    if (!vendor) {
      toast.error("الرجاء اختيار المورد");
      return;
    }

    if (!(parseInt(units) > 0)) {
      toast.error("الرجاء ادخال الوحدات بشكل صحيح");
      return;
    }

    if (!(parseFloat(mainFees) > 0)) {
      toast.error("الرجاء ادخال الرسوم الرئيسية بشكل صحيح");
      return;
    }

    try {
      //validate that total kilos is either an empty string or a positive number
      if (totalKilos.trim() !== "" && !(parseFloat(totalKilos) >= 0)) {
        toast.error("الرجاء ادخال الوزن بشكل صحيح");
        return;
      }
    } catch (error) {}

    const body = {
      standardProduct: standardProduct._id,
      vendor: vendor,
      units: parseInt(units),
      totalKilos: totalKilos ? parseInt(totalKilos) : undefined,
      mainFees: parseFloat(mainFees || 0),
      extraFees: parseFloat(extraFees || 0),
      paidMainFees: parseFloat(paidMainFees || 0),
      paidExtraFees: parseFloat(paidExtraFees || 0),
      date,
    };
    console.log({ body, paidExtraFees });
    await axios.post(`${backendURL}/purchases`, body);
    toast.success("تم اضافة عملبة الشراء بنجاح");
    return true;
  } catch (error) {
    const errorArray = error?.response?.data?.message;
    console.log({ errorArray });
    toast.error(
      typeof error?.response?.data?.message == "string"
        ? error?.response?.data?.message
        : "حدث خطأ في اضافة الشراء"
    );
    console.error("Error creating purchase", error);
  }
};

export const createNewVendor = async (values) => {
  try {
    const { name } = values;
    if (name.trim().length === 0) {
      toast.error("الرجاء ادخال اسم المورد");
      return;
    }

    await axios.post(`${backendURL}/vendors`, values);
  } catch (error) {
    console.log({ error });
    toast.error(error?.response?.data?.message || "حدث خطأ في اضافة المورد");
    console.error("Error fetching actions", error);
  }
};

export const fetchVendors = async (setVendors) => {
  try {
    const response = await axios.get(`${backendURL}/vendors`);
    setVendors(response.data);
  } catch (error) {
    console.error("Error fetching vendors", error);
  }
};

export const fetchPurchases = async (setPurchases, date) => {
  try {
    const response = await axios.get(`${backendURL}/purchases?date=${date}`);
    setPurchases(response.data);
  } catch (error) {
    console.error("Error fetching vendors", error);
  }
};

export const getWebsiteDownMessage = async (setShutDownMessage) => {
  try {
    const response = await axios.get(`${backendURL}/settings/down-message`);
    setShutDownMessage(response.data);
  } catch (error) {
    console.error("Error fetching vendors", error);
  }
};

export const setWebsiteDownMessage = async (message) => {
  try {
    await axios.patch(`${backendURL}/settings/down-message`, {
      websiteDownMessage: message,
    });
    toast.success("تم تحديث الرسالة بنجاح");
  } catch (error) {
    console.error("Error fetching vendors", error);
  }
};
