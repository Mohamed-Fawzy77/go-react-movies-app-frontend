import { Link } from "react-router-dom";
import HomeTickets from "../images/movie_tickets.jpg";
const Home = () => {
  return (
    <>
      <div className="text-center">
        <h2>Find a Movie to Watch </h2>
        <hr />
        <Link to="/movies">
          <img src={HomeTickets} alt="home tickets" />
        </Link>
      </div>
    </>
  );
};

export default Home;
