import { Link } from "react-router-dom";
import "./EmptyState.css";
import { Icon } from "@iconify/react";

const EmptyState = () => {
  return (
    <div className="empty-state">

      <div className="empty-icon">

        <Icon icon="solar:document-text-bold" />

      </div>

      <h2>No Blogs Found</h2>

      <p>
        There are no blog posts available yet.
        Start writing and share your ideas
        with the community.
      </p>

      <Link to="/blog/new" className="empty-btn" >
        Create Your First Blog
      </Link>

    </div>
  );
};

export default EmptyState;