import { useRef } from "react";
import { updateActivePPSortIndex } from "../http/product";
import { toast } from "react-toastify";

export function ActivePP({ PP, handleUpdatePPSortIndex }) {
  const inputRef = useRef();

  const handleUpdateSortIndex = async () => {
    const newSortIndex = inputRef.current.value;
    await updateActivePPSortIndex(PP._id, newSortIndex);
    handleUpdatePPSortIndex(PP._id, newSortIndex);
  };

  return (
    <li key={PP.id} style={{ display: "flex", justifyContent: "space-between", width: "350px" }}>
      {PP.product.name}
      <div>
        <input ref={inputRef} type="number" defaultValue={PP.sortIndex} style={{ width: "70px" }} />
        <button onClick={handleUpdateSortIndex}>update</button>
      </div>
    </li>
  );
}
