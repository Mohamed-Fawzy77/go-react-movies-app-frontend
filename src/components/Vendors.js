import { useEffect, useState } from "react";
import { fetchVendors } from "../http/product";
import { useOutletContext } from "react-router-dom";

export default function Vendors({ setSelectedVendor, selectedVendor }) {
  const { vendors } = useOutletContext();

  return (
    <div>
      <div className="mb-1">المورد</div>
      <select
        value={selectedVendor}
        onChange={(e) => setSelectedVendor(e.target.value)}
        style={{ width: "100%", padding: "8px" }}
      >
        <option value={""}>اختر البائع</option>
        {vendors.map((agent, index) => (
          <option key={index} value={agent._id}>
            {agent.name}
          </option>
        ))}
      </select>
    </div>
  );
}
