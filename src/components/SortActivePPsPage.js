import { useEffect, useState } from "react";
import { fetchActivePPs } from "../http/product";
import { ActivePP } from "./ActivePP";

export function SortActivePPs() {
  const [PPs, setPPs] = useState([]);

  const handleUpdateProductSortIndex = (productId, newSortIndex) => {
    setPPs((prevPPs) =>
      prevPPs.map((PP) =>
        PP.product._id === productId ? { ...PP, product: { ...PP.product, sortIndex: newSortIndex } } : PP
      )
    );
  };

  useEffect(() => {
    fetchActivePPs(setPPs);
  }, []);

  const handleCopyItemsPricesString = () => {
    const prices = PPs.map((PP) => `${PP.product.name} ب ${PP.totalPrice} جنيه`).join("\n");
    navigator.clipboard.writeText(prices);
  };

  const uniqueProductsMap = {};

  PPs.forEach((PP) => {
    if (!uniqueProductsMap[PP.product._id]) {
      uniqueProductsMap[PP.product._id] = PP;
    }
  });

  const uniqueProducts = Object.values(uniqueProductsMap);

  return (
    <>
      <button onClick={handleCopyItemsPricesString}>copy prices</button>

      {/* <ul>
        {PPs.sort((a, b) => a.sortIndex - b.sortIndex).map((PP) => (
          <ActivePP key={PP._id} handleUpdatePPSortIndex={handleUpdatePPSortIndex} PP={PP} />
        ))}
      </ul> */}

      <ul>
        {uniqueProducts
          .sort((a, b) => a.product.sortIndex - b.product.sortIndex)
          .map((PP) => (
            <ActivePP key={PP._id} handleUpdatePPSortIndex={handleUpdateProductSortIndex} PP={PP} />
          ))}
      </ul>
    </>
  );
}
