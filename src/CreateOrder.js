import axios from "axios";
import React, { useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
// import Modal from "./components/Modal";
import Modal from "react-modal";
import AddUserForm from "./components/AddUserForm";
import { toast } from "react-toastify";
Modal.setAppElement("#root");

const modalStyle = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

const backendURL = process.env.REACT_APP_BACKEND_URL;
function filiterInActiveEntities(SPs) {
  const filteredData = SPs.map((standardProduct) => {
    // Filter active products within each standard product
    const activeProducts = standardProduct.products
      .map((product) => {
        // Filter active product pricings within each product
        const activePricings = product.productPricings.filter((pricing) => pricing.isActive);

        // Only keep the product if it has active pricings
        return activePricings.length > 0 ? { ...product, productPricings: activePricings } : null;
      })
      .filter((product) => product !== null); // Remove null products

    // Only keep the standard product if it has active products
    return activeProducts.length > 0 ? { ...standardProduct, products: activeProducts } : null;
  }).filter((standardProduct) => standardProduct !== null); // Remove null standard products

  return filteredData;
}

const CreateOrder = () => {
  const { users, data, deliveryAgents, jwt } = useOutletContext();
  const [orderProducts, setOrderProducts] = useState([]);
  const [deliveryFee, setDeliveryFee] = useState("25");
  const [discount, setDiscount] = useState(0);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [userSearch, setUserSearch] = useState("");
  const [deliveryDateOption, setDeliveryDateOption] = useState("today");
  const [customDeliveryDate, setCustomDeliveryDate] = useState("");
  const [selectedDeliveryAgent, setSelectedDeliveryAgent] = useState(null);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
  const [toBeDeactivatedPPId, setToBeDeactivatedProduct] = useState(null);
  const [toBeDeactivatedProductText, setToBeDeactivatedProductText] = useState(null);
  const [isUpdateUserModalOpen, setIsUpdateUserModalOpen] = useState(false);
  const [stateUser, setStateUser] = useState({});
  const [notes, setNotes] = useState("");
  const { id } = useParams();
  const [deactivatedPPs, setDeactivatedPPs] = useState([]);
  const [isPaidOnline, setIsPaidOnline] = useState(false);
  const [isBypassMultipleOrdersModalOpen, setIsBypassMultipleOrdersModalOpen] = useState(false);
  const [currentUserOrders, setCurrentUserOrders] = useState({
    orders: [],
    prevDayOrders: [],
  });

  const SPs = filiterInActiveEntities(data);
  const isUpdating = !!id;

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        if (!id) {
          return;
        }

        const res = await axios.get(`${backendURL}/orders/${id}`);

        const order = res.data;

        const orderProducts = [];

        for (const orderProduct of order.orderProducts) {
          const PPId = orderProduct.productPricing._id || orderProduct.productPricing;
          orderProducts.push({
            _id: orderProduct._id,
            quantity: orderProduct.quantity,
            productPricing: PPId,
          });
        }

        const buyerId = order.buyer._id || order.buyer;

        setOrderProducts(orderProducts);
        setDeliveryFee(order.deliveryFee);
        setDiscount(order.discount);
        setSelectedUserId(buyerId);
        setSelectedDeliveryAgent(order.deliveryAgent ? order.deliveryAgent._id : null);
        setDeliveryDateOption(order.deliveryDate);
        setCustomDeliveryDate(order.deliveryDate);
        setNotes(order.notes);
        setIsPaidOnline(order.isPaidOnline || false);

        const isDeliveryDayToday = new Date(order.deliveryDate).toDateString() === new Date().toDateString();
        const isDeliveryDayTomorrow =
          new Date(order.deliveryDate).toDateString() ===
          new Date(Date.now() + 24 * 60 * 60 * 1000).toDateString();
        if (isDeliveryDayToday) {
          setDeliveryDateOption("today");
        } else if (isDeliveryDayTomorrow) {
          setDeliveryDateOption("tomorrow");
        } else {
          setDeliveryDateOption("custom");
        }
      } catch (error) {
        toast.error("Error fetching order");
        console.error("error", error);
      }
    };

    fetchOrder();
  }, [id]);

  const user = users.find((user) => user._id === selectedUserId) || {};

  const finalUser = Object.keys(stateUser).length ? stateUser : user;

  const UserAdded = (user) => {
    setSelectedUserId(user._id);
    setStateUser(user);
  };

  const PPMap = {};

  for (const SP of SPs) {
    for (const product of SP.products) {
      for (const PP of product.productPricings) {
        PP.productName = product.name;
        PPMap[PP._id] = PP;
      }
    }
  }

  const removeFromOrder = (productPricing) => {
    setOrderProducts((prevOrderProducts) => {
      const productPricingId = productPricing._id || productPricing;

      const existingIndex = prevOrderProducts.findIndex(
        (orderProduct) => orderProduct.productPricing === productPricingId
      );

      if (existingIndex !== -1) {
        const firstPart = prevOrderProducts.slice(0, existingIndex);
        const secondPart = prevOrderProducts.slice(existingIndex + 1);

        if (prevOrderProducts[existingIndex].quantity === 1) {
          const updatedOrder = [...firstPart, ...secondPart];
          return updatedOrder;
        } else {
          const updatedOrder = [
            ...firstPart,
            {
              ...prevOrderProducts[existingIndex],
              quantity: prevOrderProducts[existingIndex].quantity - 1,
            },
            ...secondPart,
          ];
          return updatedOrder;
        }
      } else {
        toast.error("Product not found in order");
      }
    });
  };
  const addToOrder = (productPricing) => {
    setOrderProducts((prevOrderProducts) => {
      const existingIndex = prevOrderProducts.findIndex(
        (orderProduct) => orderProduct.productPricing === productPricing._id
      );

      if (existingIndex !== -1) {
        const firstPart = prevOrderProducts.slice(0, existingIndex);
        const secondPart = prevOrderProducts.slice(existingIndex + 1);

        const updatedOrder = [
          ...firstPart,
          {
            ...prevOrderProducts[existingIndex],
            quantity: prevOrderProducts[existingIndex].quantity + 1,
          },
          ...secondPart,
        ];

        return updatedOrder;
      } else {
        // Add new product pricing entry with initial values
        return [
          ...prevOrderProducts,
          {
            quantity: 1,
            productPricing: productPricing._id,
          },
        ];
      }
    });
  };

  const calculateTotalCost = () => {
    let totalCost = 0;

    for (const orderProduct of orderProducts) {
      const productPricing = PPMap[orderProduct.productPricing];
      totalCost += productPricing.totalPrice * orderProduct.quantity;
    }

    return totalCost + parseInt(deliveryFee) - parseInt(discount);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.type === "buyer" &&
      `${user.phone} ${user.name} ${user.address}`.toLowerCase().includes(userSearch.toLowerCase())
  );

  const deliveryDate =
    deliveryDateOption === "today"
      ? new Date(Date.now()).toISOString().slice(0, 10)
      : deliveryDateOption === "tomorrow"
      ? new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
      : new Date(customDeliveryDate || Date.now()).toISOString().slice(0, 10);

  const handleCreateOrUpdateOrder = async (bypassMultipleOrders) => {
    try {
      if (!selectedUserId) {
        toast.error("Please select a user");
        return;
      }

      if (orderProducts.length === 0) {
        toast.error("Please add products to the order");
        return;
      }

      if (isUpdating) {
        try {
          await axios.put(
            `${backendURL}/orders/${id}`,
            {
              orderProducts: orderProducts,
              deliveryFee: parseInt(deliveryFee),
              discount: parseInt(discount),
              buyer: selectedUserId,
              deliveryAgent: selectedDeliveryAgent === "None" ? null : selectedDeliveryAgent,
              deliveryDate,
              notes,
              isPaidOnline,
            },
            {
              headers: {
                Authorization: `Bearer ${jwt}`,
              },
            }
          );

          toast.success("تم تحديث الطلب بنجاح");
        } catch (error) {
          toast.error("Error Updating Order");
          console.error("Error updating order:", error);
        }
      } else {
        const response = await axios.get(
          `${backendURL}/orders/user-orders/${selectedUserId}/${deliveryDate}`
        );

        if (
          !bypassMultipleOrders &&
          (response.data.orders.length > 0 || response.data.prevDayOrders.length > 0)
        ) {
          setCurrentUserOrders(response.data);
          setIsBypassMultipleOrdersModalOpen(true);
          return;
        }

        await axios.post(
          `${backendURL}/orders`,
          {
            orderProducts: orderProducts,
            deliveryFee: parseInt(deliveryFee),
            discount: parseInt(discount),
            buyer: selectedUserId,
            deliveryAgent: selectedDeliveryAgent === "None" ? null : selectedDeliveryAgent,
            deliveryDate,
            notes,
            isPaidOnline,
          },
          {
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
          }
        );

        setOrderProducts([]);
        setDeliveryFee("25");
        setDiscount(0);
        setSelectedUserId(null);
        setSelectedDeliveryAgent(null);
        setCustomDeliveryDate("");
        setNotes("");
        setIsPaidOnline(false);
        toast.success("تم انشاء الطلب بنجاح");
      }
    } catch (error) {
      toast.error("Error Creating Order");
      console.error("Error creating order:", error);
    }
  };

  if (!data.length) {
    return <>loading....</>;
  }

  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {/* Delivery Agent Selection */}
        <div style={{ flex: 1 }}>
          <h4>Select Delivery Agent:</h4>
          <select
            value={selectedDeliveryAgent}
            onChange={(e) => setSelectedDeliveryAgent(e.target.value)}
            style={{ width: "100%", padding: "8px" }}
          >
            <option value={"None"}>Select a delivery agent</option>
            {deliveryAgents.map((agent, index) => (
              <option key={index} value={agent._id}>
                {agent.name}
              </option>
            ))}
          </select>
        </div>

        {/* Delivery Date Selection */}
        <div style={{ flex: 1 }}>
          <h4>Order Delivery Date:</h4>
          <label>
            <input
              type="radio"
              name="deliveryDate"
              value="today"
              checked={deliveryDateOption === "today"}
              onChange={(e) => setDeliveryDateOption(e.target.value)}
            />
            Today
          </label>
          <label>
            <input
              type="radio"
              name="deliveryDate"
              value="tomorrow"
              checked={deliveryDateOption === "tomorrow"}
              onChange={(e) => setDeliveryDateOption(e.target.value)}
            />
            Tomorrow
          </label>
          <label>
            <input
              type="radio"
              name="deliveryDate"
              value="custom"
              checked={deliveryDateOption === "custom"}
              onChange={(e) => setDeliveryDateOption(e.target.value)}
            />
            Custom
          </label>
          {deliveryDateOption === "custom" && (
            <input
              type="date"
              value={customDeliveryDate}
              onChange={(e) => setCustomDeliveryDate(e.target.value)}
              style={{ display: "block", marginTop: "8px" }}
            />
          )}
        </div>
      </div>

      <hr />

      {/* User Selection, Delivery Fee, and Discount Row */}
      <div style={{ display: "flex", marginRight: "100px" }}>
        {/* User Selection */}
        <div style={{ flex: 1, marginRight: "10px" }}>
          <h4>Select User:</h4>
          <input
            type="text"
            placeholder="Search user by phone, name, or address"
            value={userSearch}
            onChange={(e) => setUserSearch(e.target.value)}
            style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          />
          <select
            value={selectedUserId}
            onChange={(e) => {
              setSelectedUserId(e.target.value);
              setStateUser({});
            }}
            style={{ width: "100%", padding: "8px" }}
          >
            <option value="">Select a user</option>
            {filteredUsers.map((user) => (
              <option key={user._id} value={user._id}>
                {user.phone} - {user.name} - {user.address}
              </option>
            ))}
          </select>
          <button onClick={() => setIsAddUserModalOpen(true)}>اضافة مستخدم</button>
          <button onClick={() => setIsUpdateUserModalOpen(true)}>تعديل مستخدم</button>
        </div>

        {/* Delivery Fee */}
        <div style={{ flex: 1, marginRight: "10px" }}>
          <h4>Select Delivery Fee:</h4>
          <label>
            <input
              type="radio"
              name="deliveryFee"
              value={0}
              onChange={(e) => setDeliveryFee(e.target.value)}
              checked={deliveryFee === "0"}
            />{" "}
            0&nbsp;&nbsp;&nbsp;
          </label>
          <label>
            <input
              type="radio"
              name="deliveryFee"
              value={20}
              defaultChecked
              onChange={(e) => setDeliveryFee(e.target.value)}
              checked={deliveryFee === "20"}
            />{" "}
            20&nbsp;&nbsp;&nbsp;
          </label>
          <label>
            <input
              type="radio"
              name="deliveryFee"
              value={25}
              onChange={(e) => setDeliveryFee(e.target.value)}
              checked={deliveryFee === "25"}
            />
            25 &nbsp;&nbsp;&nbsp;
          </label>
          <label>
            <input
              type="radio"
              name="deliveryFee"
              value={30}
              onChange={(e) => setDeliveryFee(e.target.value)}
              checked={deliveryFee === "30"}
            />
            30 &nbsp;&nbsp;&nbsp;
          </label>
          <label>
            Custom:
            <input
              type="number"
              min="0"
              value={deliveryFee}
              onChange={(e) => setDeliveryFee(e.target.value)}
              style={{ marginLeft: "5px", width: "60px" }}
            />
          </label>
          <br />
          <label>Notes:</label> <br />
          <textarea
            name="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            style={{ height: "50px", width: "200px" }}
          />
          {/* <div> */}
          <input
            type="checkbox"
            checked={isPaidOnline}
            onChange={(e) => setIsPaidOnline(e.target.checked)}
            style={{ marginLeft: "10px", height: "20px", width: "20px" }}
          />{" "}
          online payment
          {/* </div> */}
        </div>

        {/* Discount */}
        <div style={{ flex: 1 }}>
          <h4>Discount:</h4>
          <input
            type="number"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            style={{ width: "80px" }}
          />
        </div>
      </div>

      <hr />

      {/* Product Buttons */}
      <div style={{ display: "flex", marginRight: "200px", flexWrap: "wrap", border: "1px solid #ccc" }}>
        {/* <div style={{ flex: 3 }}> */}
        {SPs.map((item, index) => (
          <div key={index} style={{ minWidth: "250px", marginBottom: "50px" }}>
            <h3>{item.name}</h3>
            {item.products.map((product, index) => (
              <div key={index}>
                <h4>{product.name}</h4>
                {product.productPricings
                  .filter((PP) => {
                    return PP.isActive;
                  })
                  .map((PP, index) => (
                    <div style={{ display: deactivatedPPs.includes(PP._id) ? "none" : "block" }}>
                      <button key={index} onClick={() => addToOrder(PP)}>
                        {PP.units} x {PP.totalKilos || "-"} x {PP.pricePerKiloOrUnit || "-"} = {PP.totalPrice}
                      </button>
                      {/* zz */}
                      <button
                        className="btn btn-danger"
                        onClick={() => {
                          setIsDeactivateModalOpen(true);
                          setToBeDeactivatedProduct(PP._id);
                          setToBeDeactivatedProductText(
                            ` ${item.name} \n ${product.name} \n ${PP.units} x ${PP.totalKilos || "-"} x ${
                              PP.pricePerKiloOrUnit || "-"
                            } = ${PP.totalPrice}`
                          );
                        }}
                      >
                        تعطيل
                      </button>
                      <br />
                    </div>
                  ))}
              </div>
            ))}
          </div>
        ))}
        {/* </div> */}

        {/* Fixed Order Summary */}
        <div
          style={{
            position: "fixed",
            right: "20px",
            top: "20px",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            width: "350px",
            backgroundColor: "#f9f9f9",
            direction: "rtl",
          }}
        >
          <h3>Order Products:</h3>
          <ul>
            {orderProducts.map((orderProduct, index) => {
              const { productPricing: productPricingId, quantity } = orderProduct;
              const PP = PPMap[productPricingId];
              return (
                <li key={index}>
                  {PP.productName}: {PP.units * quantity} * {PP.totalKilos * quantity || "-"} *{" "}
                  {PP.pricePerKiloOrUnit || "-"} = {PP.totalPrice * quantity}
                  <button onClick={() => addToOrder(PP)}>+</button>
                  <button onClick={() => removeFromOrder(PP)}>-</button>
                </li>
              );
            })}

            {deliveryFee > 0 && <li>توصيل: {deliveryFee}</li>}
            {discount > 0 && <li>خصم: {discount}</li>}
          </ul>
          <hr />
          <h4>الاجمالى : {calculateTotalCost()}</h4>
          <button style={{ width: "100%", height: "50px" }} onClick={() => handleCreateOrUpdateOrder()}>
            {isUpdating ? "تعديل الطلب" : "اضافة الطلب"}
          </button>
          تاريخ التسليم : {deliveryDateOption}({deliveryDate})<br />
          اسم المشترى: {finalUser.name || "-"} <br />
          عنوان المشترى: {finalUser.address || "-"} <br />
          رقم الهاتف: {finalUser.phone || "-"} <br />
          الاى دى: {finalUser._id || "-"} <br />
        </div>
      </div>

      {/* bypass multiple orders modal */}
      <Modal
        isOpen={isBypassMultipleOrdersModalOpen}
        onRequestClose={() => setIsBypassMultipleOrdersModalOpen(false)}
        contentLabel="Example Modal"
        style={modalStyle}
      >
        <h2>
          هذا المستخدم لديه {currentUserOrders.orders.length}{" "}
          {currentUserOrders.orders.length === 1 ? "طلب" : "طلبات"} لليوم الحالى
        </h2>

        <p className="mb-0">----------------------------</p>

        <h2>
          هذا المستخدم لديه {currentUserOrders.prevDayOrders.length}{" "}
          {currentUserOrders.prevDayOrders.length === 1 ? "طلب" : "طلبات"} فى اليوم السابق
        </h2>

        <button
          onClick={() => {
            handleCreateOrUpdateOrder(true);
            setIsBypassMultipleOrdersModalOpen(false);
          }}
        >
          موافق
        </button>

        <br />
        <button onClick={() => setIsBypassMultipleOrdersModalOpen(false)}>اغلاق</button>
      </Modal>

      {/* add user modal */}
      <Modal
        isOpen={isAddUserModalOpen}
        onRequestClose={() => setIsAddUserModalOpen(false)}
        contentLabel="Example Modal"
        style={modalStyle}
      >
        <h2>اضافة مستخدم</h2>
        <AddUserForm UserAdded={UserAdded} />
        <button onClick={() => setIsAddUserModalOpen(false)}>اغلاق</button>
      </Modal>

      <Modal
        isOpen={isUpdateUserModalOpen}
        onRequestClose={() => setIsUpdateUserModalOpen(false)} // Closes the modal when clicking outside or pressing "Escape"
        contentLabel="Example Modal"
        style={modalStyle}
      >
        <h2>تعديل المستخدم</h2>
        <AddUserForm UserAdded={UserAdded} toBeUpdatedUser={user} />
        <button onClick={() => setIsUpdateUserModalOpen(false)}>اغلاق</button>
      </Modal>

      {/* de activate modal  */}
      <Modal
        isOpen={isDeactivateModalOpen}
        onRequestClose={() => setIsDeactivateModalOpen(false)} // Closes the modal when clicking outside or pressing "Escape"
        contentLabel="Example Modal"
        style={modalStyle}
      >
        <h2>هل تريد تعطيل هذا المنتج؟</h2>

        <p style={{ whiteSpace: "pre-line" }}>{toBeDeactivatedProductText}</p>
        <br />
        <button
          className="btn btn-danger mt-5 mb-5 mr-5 ml-5"
          // className="btn btn-sm btn-primary"
          onClick={() => {
            axios
              .put(`${backendURL}/product-pricings/${toBeDeactivatedPPId}`, {
                isActive: false,
              })
              .then(() => {
                toast.success("Pricing deactivated successfully");
                setIsDeactivateModalOpen(false);
                setDeactivatedPPs([...deactivatedPPs, toBeDeactivatedPPId]);
              })
              .catch((err) => {
                toast.error("couldn't update pricing");
                console.error(err);
              });
          }}
        >
          Deactivate
        </button>
        <br />
        <button onClick={() => setIsDeactivateModalOpen(false)}>اغلاق</button>
      </Modal>
    </div>
  );
};

export default CreateOrder;
