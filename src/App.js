import { Link, Outlet, useNavigate } from "react-router-dom";
import Alert from "./components/Alert";
import { useEffect, useState } from "react";
import { capitalize } from "./utils/string";

function App() {
  const [alertMessage, setAlertMessage] = useState("");
  const [alertClassName, setAlertClassName] = useState("d-none");
  const [jwt, setJwt] = useState("");
  const [SPs, setSPs] = useState([]);

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
        const response = await fetch("http://localhost:5000/product-pricings", { method: "GET" });
        const data = await response.json();

        setSPs(data);
      } catch (error) {
        setDangerAlert("couldn't fetch product pricing");
      }
    };

    fetchPP();
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

  return (
    <div className="container">
      <Alert className={alertClassName} message={alertMessage} />
      <div className="row">
        <div className="col">
          <h1 className="mt-3 text-center">Delivery Souq Gomla</h1>
        </div>
        <div className="col text-end">
          {jwt ? (
            <a href="#!">
              <span onClick={logout} className="badge bg-danger">
                logout
              </span>
            </a>
          ) : (
            <Link to="/login">
              <span className="badge bg-success">login</span>
            </Link>
          )}
        </div>
        <hr className="mb-3"></hr>
      </div>

      <div className="row">
        <div className="col-md-2">
          <nav>
            <div className="list-group">
              {jwt && (
                <>
                  <Link to="/" className="list-group-item list-group-item-action">
                    Home
                  </Link>
                  <Link to="/orders" className="list-group-item list-group-item-action">
                    Orders
                  </Link>
                  <Link to="/create-order" className="list-group-item list-group-item-action">
                    Create Order
                  </Link>

                  <Link to="/sps" className="list-group-item list-group-item-action">
                    Standard Products
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
        <div className="col-md-10">
          <Outlet
            context={{
              removeAlert,
              setDangerAlert,
              login,
              PP: SPs,
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
