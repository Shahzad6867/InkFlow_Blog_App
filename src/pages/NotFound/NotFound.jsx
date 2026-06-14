import "./NotFound.css";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="not-found-page">

      <div className="not-found-card">

        <div className="error-icon">
          <Icon icon="solar:danger-triangle-bold" />
        </div>

        <h1>404</h1>

        <h2>Page Not Found</h2>

        <p>
          The page you're looking for doesn't
          exist or may have been moved.
        </p>

        <Link
          to="/home"
          className="home-btn"
        >
          Go Back Home
        </Link>

      </div>

    </div>
  );
};

export default NotFound;