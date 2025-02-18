import { useRef } from "react";
import { updateProductSortIndex } from "../http/product";
import { toast } from "react-toastify";

export function ActivePP({ PP, handleUpdatePPSortIndex }) {
  const inputRef = useRef();

  const handleUpdateSortIndex = async () => {
    const newSortIndex = inputRef.current.value;
    await updateProductSortIndex(PP.product._id, newSortIndex);
    handleUpdatePPSortIndex(PP.product._id, newSortIndex);
  };

  return (
    <li key={PP.id} style={{ display: "flex", justifyContent: "space-between", width: "650px" }}>
      {PP.product.name}
      <div>
        <input ref={inputRef} type="number" defaultValue={PP.product.sortIndex} style={{ width: "70px" }} />
        <button onClick={handleUpdateSortIndex}>update</button>
        {!PP.product.image && !PP.product.standardProduct.image ? (
          <span style={{ color: "red" }}>no image for this product!</span>
        ) : (
          <span style={{ color: "green" }}>there is image for product</span>
        )}
      </div>
    </li>
  );
}
