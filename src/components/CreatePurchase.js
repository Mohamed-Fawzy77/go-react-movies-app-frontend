import { useRef, useState } from "react";
import { addPurchase } from "../http/product";
import Vendors from "./Vendors";
import { set } from "@cloudinary/url-gen/actions/variable";

export default function CreateNewPurchase({ standardProduct, setIsModalOpen }) {
  const unitsRef = useRef();
  const totalKilosRef = useRef();
  const mainFeesRef = useRef();
  const extraFeesRef = useRef();
  const isMainFeesPaid = useRef();
  const isExtraFeesPaid = useRef();
  const [selectedVendor, setSelectedVendor] = useState("");

  const handleAddPurchase = async (e) => {
    e.preventDefault();

    const success = await addPurchase({
      standardProduct,
      vendor: selectedVendor,
      units: unitsRef.current.value,
      totalKilos: totalKilosRef.current.value,
      mainFees: mainFeesRef.current.value,
      isMainFeesPaid: isMainFeesPaid.current.checked,
      extraFees: extraFeesRef.current.value,
      isExtraFeesPaid: isExtraFeesPaid.current.checked,
    });

    if (!success) return;
    unitsRef.current.value = "";
    totalKilosRef.current.value = "";
    mainFeesRef.current.value = "";
    extraFeesRef.current.value = "";
    setSelectedVendor("");
  };

  return (
    <div style={{ border: "1px solid black", padding: "20px 100px 20px 100px" }}>
      <form>
        <h2>Add Purchase</h2>
        <h6>الوحدات</h6>
        <input type="number" ref={unitsRef} placeholder="Units" min={1} />
        <br />
        <br />
        <h6>إجمالي الوزن </h6>
        <input type="number" ref={totalKilosRef} placeholder="Total Kilos" min={0} />
        <br />
        <br />
        <h6> الرسوم الرئيسية</h6>
        {/* <br /> */}
        <input type="number" ref={mainFeesRef} min="0" />
        <br />
        <div>
          <input
            type="checkbox"
            ref={isMainFeesPaid}
            defaultChecked
            style={{ width: "30px", height: "30px" }}
          />
          <span>مدفوع</span>
        </div>
        <br />

        <h6> رسوم إضافية</h6>
        {/* <br /> */}
        <input type="number" ref={extraFeesRef} min={0} />
        <br />
        <div>
          <input
            type="checkbox"
            ref={isExtraFeesPaid}
            defaultChecked
            style={{ width: "30px", height: "30px" }}
          />
          <span>مدفوع</span>
        </div>
        <br />

        <Vendors setSelectedVendor={setSelectedVendor} selectedVendor={selectedVendor} />
        <br />
        <button onClick={handleAddPurchase}>Complete Purchase</button>
        <button onClick={() => setIsModalOpen(false)}>close</button>
      </form>
    </div>
  );
}
