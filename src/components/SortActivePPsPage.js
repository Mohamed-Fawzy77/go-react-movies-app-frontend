import { useEffect, useState } from "react";
import { fetchActivePPs } from "../http/product";
import { ActivePP } from "./ActivePP";

export function SortActivePPs() {
  const [PPs, setPPs] = useState([]);

  const handleUpdatePPSortIndex = (ppId, newSortIndex) => {
    setPPs((prevPPs) => prevPPs.map((PP) => (PP._id === ppId ? { ...PP, sortIndex: newSortIndex } : PP)));
  };

  useEffect(() => {
    fetchActivePPs(setPPs);
  }, []);

  const handleCopyItemsPricesString = () => {
    const prices = PPs.map((PP) => `${PP.product.name} ب ${PP.totalPrice} جنيه`).join("\n");
    navigator.clipboard.writeText(prices);
  };

  return (
    <>
      <button onClick={handleCopyItemsPricesString}>copy prices</button>

      <ul>
        {PPs.sort((a, b) => a.sortIndex - b.sortIndex).map((PP) => (
          <ActivePP key={PP._id} handleUpdatePPSortIndex={handleUpdatePPSortIndex} PP={PP} />
        ))}
      </ul>
    </>
  );
}
