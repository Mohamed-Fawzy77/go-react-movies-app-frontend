import HomeTickets from "../images/movie_tickets.jpg";
const Home = () => {
  return (
    <>
      <div className="text-center">
        <h2>Find a Movie to Watch </h2>
        <hr />
        <img src={HomeTickets} alt="home tickets" />
      </div>
    </>
  );
};

export default Home;
