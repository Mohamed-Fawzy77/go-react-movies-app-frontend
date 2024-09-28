import { Link, useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();

  return (
    <div className="container">
      <div className="row">
        <div className="col mt-4 text-center">
          <h1>Oops!</h1>
          <h6>Sorry, an unexpected error has occurred.</h6>
          <h3>
            <em>{error.statusText || error.message}</em>
          </h3>
          <Link to="/" className="btn btn-success mt-2">
            Go To Home
          </Link>
        </div>
      </div>
    </div>
  );
}
