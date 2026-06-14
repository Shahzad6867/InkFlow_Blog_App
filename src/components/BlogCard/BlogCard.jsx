import "./BlogCard.css";
import { Icon } from "@iconify/react";
import { Link, useNavigate } from "react-router-dom";
import { contentDuration } from "../../utilities/contentDuration";
import { handleDeleteConfirmation } from "./DeleteBlogs";
import { useContext } from "react";
import { AuthUser } from "../../contexts/AuthContext";
const BlogCard = ({
  title,
  content,
  author,
  author_id,
  date,
  blog_id,
  setBlogs,
  blogs,
}) => {
  const { user } = useContext(AuthUser);
  const navigate = useNavigate();
  const duration = contentDuration(content);
  return (
    <article className="blog-card">
      <div className="blog-card-top">
        <div className="author-info">
          <div className="author-avatar">
            <Icon icon="solar:user-bold" />
          </div>

          <div>
            <p className="author-name">{author}</p>

            <span className="blog-date">{date}</span>
          </div>
        </div>
      </div>

      <div className="blog-card-content">
        <h3>{title}</h3>

        <p>{content}</p>
      </div>

      <div className="blog-card-footer">
        <div className="blog-meta">
          <Icon icon="solar:clock-circle-bold" />

          <span>{duration} min read</span>
        </div>

        <div className="card-actions">
          {user && user.user_id === author_id && (
            <>
              <Link
                to={"/blog/edit/" + blog_id}
                className="edit-btn"
                state={{ path: location.pathname }}
              >
                <Icon icon="solar:pen-bold" />
              </Link>

              <button
                className="delete-btn"
                onClick={() =>
                  handleDeleteConfirmation(blog_id, setBlogs, blogs, navigate)
                }
              >
                <Icon icon="solar:trash-bin-trash-bold" />
              </button>
            </>
          )}

          <Link to={"/blog/" + blog_id} className="read-btn">
            Read
          </Link>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;
