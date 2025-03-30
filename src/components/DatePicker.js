import { useEffect, useState } from "react";

const DatePicker = ({ onDateChange, label }) => {
  const today = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(today);

  useEffect(() => {
    onDateChange(today);
  }, [onDateChange]);

  const handleChange = (event) => {
    const newDate = event.target.value;
    setSelectedDate(newDate);
    onDateChange(newDate);
  };

  return (
    <>
      {label && (
        <>
          <label className="mt-3">{label}</label>
          <br />
        </>
      )}
      <input className="mb-3" type="date" value={selectedDate} onChange={handleChange} />
    </>
  );
};
export default DatePicker;
