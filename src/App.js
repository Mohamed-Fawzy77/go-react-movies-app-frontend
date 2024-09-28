import { Link, Outlet, useNavigate } from "react-router-dom";
import Alert from "./components/Alert";
import { useState } from "react";
import { capitalize } from "./utils/string";

function App() {
  const [alertMessage, setAlertMessage] = useState("");
  const [alertClassName, setAlertClassName] = useState("d-none");
  const [jwt, setJwt] = useState("");

  const navigate = useNavigate();

  const login = (jwt) => {
    setJwt(jwt);
    navigate("/");
  };

  const logout = () => {
    setJwt("");
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
          <h1 className="mt-3">Movies</h1>
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
              <Link to="/" className="list-group-item list-group-item-action">
                Home
              </Link>
              <Link to="/movies" className="list-group-item list-group-item-action">
                Movies
              </Link>
              <Link to="/genres" className="list-group-item list-group-item-action">
                Genres
              </Link>
              {jwt && (
                <>
                  <Link to="/admin/movie/0" className="list-group-item list-group-item-action">
                    Add Movie
                  </Link>
                  <Link to="/manage-catalogue" className="list-group-item list-group-item-action">
                    Manage Catalogue
                  </Link>
                  <Link to="/graphql" className="list-group-item list-group-item-action">
                    GraphQL
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
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
