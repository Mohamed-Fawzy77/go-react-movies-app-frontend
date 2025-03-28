import { useRef } from "react";
import { createNewVendor } from "../http/product";

export default function CreateNewVendor() {
  const nameRef = useRef(null);

  const handleCreateVendor = async () => {
    await createNewVendor({ name: nameRef.current.value });
  };
  return (
    <>
      <h3>إضافة مورد</h3>
      <input
        ref={nameRef}
        type="text"
        // value={newProduct.name}
        // onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
        placeholder="Vendor Name"
      />
      <button onClick={handleCreateVendor}>إضافة</button>
    </>
  );
}
