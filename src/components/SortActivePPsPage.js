import { useEffect, useState } from "react";
import { fetchActivePPs } from "../http/product";
import { ActivePP } from "./ActivePP";

export function SortActivePPs() {
  const [PPs, setPPs] = useState([]);

  const handleUpdatePPSortIndex = (ppId, newSortIndex) => {
    console.log({ ppId, newSortIndex });
    setPPs((prevPPs) => prevPPs.map((PP) => (PP._id === ppId ? { ...PP, sortIndex: newSortIndex } : PP)));
  };

  useEffect(() => {
    fetchActivePPs(setPPs);
  }, []);

  return (
    <ul>
      {PPs.sort((a, b) => a.sortIndex - b.sortIndex).map((PP) => (
        <ActivePP key={PP._id} handleUpdatePPSortIndex={handleUpdatePPSortIndex} PP={PP} />
      ))}
    </ul>
  );
}
