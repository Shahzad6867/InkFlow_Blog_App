import "./Loader.css";
import { Icon } from "@iconify/react";

const Loader = ({loader}) => {
    if(!loader) return null
  return (
    <div className="loader-page">

      <div className="loader-content">

        <div className="loader-logo">

          <Icon icon="solar:pen-new-square-bold" />

        </div>

        <h1>InkFlow</h1>

        <p>
          Loading amazing stories...
        </p>

        <div className="loader-bar">

          <div className="loader-progress"></div>

        </div>

      </div>

    </div>
  );
};

export default Loader;