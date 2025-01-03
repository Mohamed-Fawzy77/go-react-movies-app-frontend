import { Link, Outlet, useNavigate } from "react-router-dom";
import Alert from "./components/Alert";
import { useEffect, useState } from "react";
import { capitalize } from "./utils/string";
import axios from "axios";
import "./App.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const backendURL = process.env.REACT_APP_BACKEND_URL;

function App() {
  const [alertMessage, setAlertMessage] = useState("");
  const [alertClassName, setAlertClassName] = useState("d-none");
  const [jwt, setJwt] = useState("");
  const [SPs, setSPs] = useState([]);
  const [users, setUsers] = useState([]);
  const [deliveryAgents, setDeliveryAgents] = useState([]);
  const [data, setData] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (!jwt) {
      const token = localStorage.getItem("token");
      if (token && token !== "undefined") {
        setJwt(token);
      } else {
        navigate("/login");
      }
    } else {
      navigate("/");
    }
  }, []);

  useEffect(() => {
    const fetchPP = async () => {
      try {
        const response = await fetch(`${backendURL}/product-pricings`, { method: "GET" });
        const data = await response.json();

        setSPs(data);
      } catch (error) {
        setDangerAlert("couldn't fetch product pricing");
      }
    };

    fetchPP();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${backendURL}/users`);
        setUsers(response.data);

        const deliveryAgents = response.data.filter((user) => user.type === "delivery");
        setDeliveryAgents(deliveryAgents);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    const fetchData = async () => {
      try {
        const response = await axios.get(`${backendURL}/product-pricings/all`);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchUsers();
    fetchData();
  }, []);

  const login = (jwt) => {
    setJwt(jwt);
    localStorage.setItem("token", jwt);
    navigate("/");
  };

  const logout = () => {
    setJwt("");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const removeAlert = () => {
    setAlertMessage("");
    setAlertClassName("d-none");
  };

  const setDangerAlert = (message) => {
    setAlertMessage(capitalize(message));
    setAlertClassName("alert-danger");
  };

  // const backgroundImageStyle = {
  //   backgroundImage: "url('/bg.jpg')",
  //   backgroundSize: "cover", // Makes the image cover the entire viewport
  //   backgroundRepeat: "no-repeat", // Prevents the image from repeating
  //   backgroundPosition: "center", // Centers the image
  //   minHeight: "100vh", // Ensures it covers the viewport height
  //   width: "100%",
  // };

  const backgroundImageStyle = {
    backgroundImage: "url('/bg2.png')",
    backgroundSize: "cover", // Makes the image cover the entire viewport
    backgroundRepeat: "no-repeat", // Prevents the image from repeating
    backgroundPosition: "center", // Centers the image
    backgroundAttachment: "fixed", // Fixes the image during scrolling
    minHeight: "100vh", // Ensures it covers the viewport height
    width: "100%",
  };
  return (
    <div className="container" style={backgroundImageStyle}>
      <Alert className={alertClassName} message={alertMessage} />
      <div className="row">
        <div className="col">
          <h1 className="mt-3 text-center">Delivery Souq Gomla</h1>
        </div>
        <div className="col text-end mt-3">
          <nav className="navbar navbar-expand-lg navbar-light bg-light trans-impor">
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav">
                {jwt && (
                  <>
                    <li className="nav-item">
                      <Link to="/" className="list-group-item list-group-item-action">
                        <span className="badge bg-success">الصفحة الرئيسية</span>
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/orders" className="list-group-item list-group-item-action">
                        <span className="badge bg-success">الطلبات</span>
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/create-order" className="list-group-item list-group-item-action">
                        <span className="badge bg-success"> طلب جديد </span>
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/sps" className="list-group-item list-group-item-action">
                        <span className="badge bg-success"> المنتجات </span>
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/users" className="list-group-item list-group-item-action">
                        <span className="badge bg-success"> المستخدمين </span>
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/print" className="list-group-item list-group-item-action">
                        <span className="badge bg-success"> الطباعة </span>
                      </Link>
                    </li>
                  </>
                )}
                {jwt ? (
                  <>
                    <a href="#!">
                      <span onClick={logout} className="badge bg-danger">
                        logout
                      </span>
                    </a>
                  </>
                ) : (
                  <Link to="/login">
                    <span className="badge bg-success">login</span>
                  </Link>
                )}
              </ul>
            </div>
          </nav>
        </div>
        {/* <div className="col text-end">
          {jwt ? (
            <>
              <a href="#!">
                <span onClick={logout} className="badge bg-danger">
                  logout
                </span>
              </a>
            </>
          ) : (
            <Link to="/login">
              <span className="badge bg-success">login</span>
            </Link>
          )}
          {jwt && (
            <>
              <Link to="/" className="list-group-item list-group-item-action">
                <span className="badge bg-success">Home</span>
              </Link>
              <Link to="/orders" className="list-group-item list-group-item-action">
                Orders
              </Link>
              <Link to="/print-orders" className="list-group-item list-group-item-action">
                Print Orders
              </Link>
              <Link to="/create-order" className="list-group-item list-group-item-action">
                Create Order
              </Link>

              <Link to="/sps" className="list-group-item list-group-item-action">
                Standard Products
              </Link>
              <Link to="/users" className="list-group-item list-group-item-action">
                users
              </Link>
            </>
          )}
        </div> */}
      </div>

      <div className="row">
        <div className="col-md-12">
          <Outlet
            context={{
              removeAlert,
              setDangerAlert,
              login,
              PP: SPs,
              users,
              data,
              deliveryAgents,
              jwt,
            }}
          />
        </div>
      </div>
      <ToastContainer autoClose={2000} theme="colored" />
      <ToastContainer autoClose={2000} theme="colored" />
    </div>
  );
}

export default App;
