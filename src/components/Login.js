import { useOutletContext } from "react-router-dom";
import Input from "./form/Input";
import { useRef } from "react";

const Login = () => {
  const { removeAlert, setDangerAlert, login } = useOutletContext();

  const phone = useRef();
  const password = useRef();

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const body = JSON.stringify({ phone: phone.current.value, password: password.current.value });

      const res = await fetch("http://localhost:5000/auth/login", {
        body,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Login failed");
      }

      const data = await res.json();
      removeAlert();
      login(data.access_token);
    } catch (error) {
      console.error({ error });
      setDangerAlert("phone or password is incorrect");
    }
  };
  return (
    <>
      <div className="text-center">
        <h2>Login </h2>
        <hr />
        <form onSubmit={handleSubmit}>
          <Input title="Enter Phone" ref={phone} />
          <Input title="Enter Password" type="password" ref={password} />
          <input type="submit" className="btn btn-success col-md-4" />
        </form>
      </div>
    </>
  );
};

export default Login;
