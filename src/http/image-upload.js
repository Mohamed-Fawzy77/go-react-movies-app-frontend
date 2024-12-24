import axios from "axios";
const backendURL = process.env.REACT_APP_BACKEND_URL;

export async function uploadImage(file) {
  const image = URL.createObjectURL(file);
  const formData = new FormData();
  formData.append("image", file);
  const res = await axios.post(`${backendURL}/upload`, formData);
  console.log({ res });
  return res.data;
}
