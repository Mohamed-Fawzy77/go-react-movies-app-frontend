import { useOutletContext } from "react-router-dom";
import Input from "./form/Input";
import { useRef } from "react";

const Login = () => {
  const { removeAlert, setDangerAlert, login } = useOutletContext();

  const email = useRef();
  const password = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log({ email, v: email.current.value });
    if (email.current.value === "m@gmail.com") {
      removeAlert();
      login("jwt");
    } else {
      setDangerAlert("wrong credentials");
    }
  };
  return (
    <>
      <div className="text-center">
        <h2>Login </h2>
        <hr />
        <form onSubmit={handleSubmit}>
          <Input title="Enter Email" ref={email} />
          <Input title="Enter Password" type="password" ref={password} />
          <input type="submit" className="btn btn-success col-md-4" />
        </form>
      </div>
    </>
  );
};

export default Login;
