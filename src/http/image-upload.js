import axios from "axios";
const backendURL = process.env.REACT_APP_BACKEND_URL;

export async function uploadImage(file) {
  const formData = new FormData();
  formData.append("image", file);
  const res = await axios.post(`${backendURL}/upload`, formData);
  return res.data;
}
