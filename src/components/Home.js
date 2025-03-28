import { Link } from "react-router-dom";
import HomeTickets from "../images/movie_tickets.jpg";
import { useEffect, useState } from "react";
import { getWebsiteDownMessage, setWebsiteDownMessage } from "../http/product";
const Home = () => {
  const [isFromHidden, setIsFormHidden] = useState(true);
  const [shutDownMessage, setShutDownMessage] = useState("");
  useEffect(() => {
    getWebsiteDownMessage(setShutDownMessage);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await setWebsiteDownMessage(shutDownMessage);
  };

  return (
    <>
      <div className="text-center mt-4">
        <h1>Welcome to Home Screen</h1>
        <button onClick={() => setIsFormHidden(!isFromHidden)}>show form</button>
        <form onSubmit={handleSubmit} hidden={isFromHidden} className="mt-4">
          <p>
            note: if the message is empty this will cause the website to work normal
            <br />
            if it has anything in it, the website will be down
          </p>
          <textarea
            style={{ width: "300px", height: "100px" }}
            onInput={(e) => setShutDownMessage(e.target.value)}
            type="text"
            placeholder="Enter shut down message"
            value={shutDownMessage}
          />{" "}
          <br />
          <button type="submit">Change Status</button>
        </form>
      </div>
    </>
  );
};

export default Home;
