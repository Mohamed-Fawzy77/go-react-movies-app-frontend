import { useRef, useState } from "react";
import { addPurchase } from "../http/product";
import Vendors from "./Vendors";
import { set } from "@cloudinary/url-gen/actions/variable";
import DatePicker from "./DatePicker";

export default function CreateNewPurchase({ standardProduct, setIsModalOpen }) {
  const unitsRef = useRef();
  const totalKilosRef = useRef();
  const mainFeesRef = useRef();
  const paidMainFees = useRef();
  const paidExtraFees = useRef();
  const extraFeesRef = useRef();
  const [isMainFeesFullyPaid, setIsMainFeesFullyPaid] = useState(true);
  const [isExtraFeesFullyPaid, setIsExtraFeesFullyPaid] = useState(true);
  // const isMainFeesPaid = useRef();
  // const isExtraFeesPaid = useRef();
  const [selectedVendor, setSelectedVendor] = useState("");
  const [selectedDate, setSelectedDate] = useState();

  const handleAddPurchase = async (e) => {
    e.preventDefault();

    const success = await addPurchase({
      standardProduct,
      vendor: selectedVendor,
      units: unitsRef.current.value,
      totalKilos: totalKilosRef.current.value,
      mainFees: mainFeesRef.current.value,
      extraFees: extraFeesRef.current.value,
      paidMainFees: (isMainFeesFullyPaid ? mainFeesRef.current.value : paidMainFees.current.value) || 0,
      paidExtraFees: (isExtraFeesFullyPaid ? extraFeesRef.current.value : paidExtraFees.current.value) || 0,
      date: selectedDate,
    });

    if (!success) return;
    unitsRef.current.value = "";
    totalKilosRef.current.value = "";
    mainFeesRef.current.value = "";
    extraFeesRef.current.value = "";
    setSelectedVendor("");
  };
  const spaces = <span>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</span>;

  return (
    <div style={{ border: "1px solid black", padding: "20px 100px 20px 100px" }}>
      <form>
        <h2>Add Purchase</h2>
        <h6>الوحدات</h6>
        <input type="number" defaultValue={1} ref={unitsRef} placeholder="Units" min={1} />
        <br />
        <br />
        <h6>إجمالي الوزن </h6>
        <input type="number" ref={totalKilosRef} placeholder="Total Kilos" min={0} />
        <br />
        <br />
        <h6> الرسوم الرئيسية</h6>
        <input type="number" ref={mainFeesRef} min="0" />
        <br />
        <div>
          <input
            type="checkbox"
            checked={isMainFeesFullyPaid}
            onChange={(e) => setIsMainFeesFullyPaid(e.target.checked)}
            style={{ width: "30px", height: "30px" }}
          />
          <span> مدفوع بالكامل</span>
          <br />
          <input
            type="number"
            ref={paidMainFees}
            min="0"
            style={{ opacity: isMainFeesFullyPaid ? "0%" : "100%" }}
            disabled={isMainFeesFullyPaid}
          />
        </div>
        <br />
        {/* ----------------------------------- */}
        {/* ----------------------------------- */}
        {/* ----------------------------------- */}
        <h6> رسوم إضافية</h6>
        {/* <br /> */}
        <input type="number" ref={extraFeesRef} min={0} />
        <br />
        <div>
          <input
            type="checkbox"
            onChange={(e) => setIsExtraFeesFullyPaid(e.target.checked)}
            checked={isExtraFeesFullyPaid}
            style={{ width: "30px", height: "30px" }}
          />
          <span>مدفوع بالكامل</span>
          {/* <br style={{ display: isExtraFeesFullyPaid ? "none" : "default" }} /> */}
          <br />
          <input
            type="number"
            ref={paidExtraFees}
            min="0"
            style={{ opacity: isExtraFeesFullyPaid ? "0%" : "100%" }}
            disabled={isExtraFeesFullyPaid}
          />
        </div>
        <br />

        <Vendors setSelectedVendor={setSelectedVendor} selectedVendor={selectedVendor} />
        <DatePicker onDateChange={setSelectedDate} label="يوم الشراء" />

        <br />
        <button onClick={handleAddPurchase}>Complete Purchase</button>
        <button onClick={() => setIsModalOpen(false)}>close</button>
      </form>
    </div>
  );
}
