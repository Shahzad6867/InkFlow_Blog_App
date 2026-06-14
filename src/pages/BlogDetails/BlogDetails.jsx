import "./BlogDetails.css";
import Navbar from "../../components/Navbar/Navbar";
import { Icon } from "@iconify/react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState, useRef, useContext } from "react";
import { doc, getDoc, updateDoc, increment, getDocs } from "firebase/firestore";
import {contentDuration} from '../../utilities/contentDuration'
import { db } from "../../firebase";
import { AuthUser } from "../../contexts/AuthContext";
import { handleDeleteConfirmation } from "../../components/BlogCard/DeleteBlogs";
import { Toaster } from "react-hot-toast";
import { BlogProvider } from "../../contexts/BlogProvider";

const BlogDetails = () => {
  const params = useParams();
  const [blog, setBlog] = useState({});
  const hasIncremented = useRef(false);
  const { user } = useContext(AuthUser);
  const { blogs, setBlogs } = useContext(BlogProvider);
  const navigate = useNavigate();
  const { blog_id } = params;
  useEffect(() => {
    async function getBlog() {
      const docSnap = await getDoc(doc(db, "blogs", blog_id));
      if (!hasIncremented.current) {
        hasIncremented.current = true;
        await updateDoc(doc(db, "blogs", blog_id), {
          views: increment(1),
        });
        setBlogs(
          blogs.map((blog) => {
            if (blog.blog_id === blog_id && !blog.isDrafted) {
              blog.views = blog.views + 1;
            }
            return blog;
          })
        );
      }

      setBlog(docSnap.data());
    }
    getBlog();
  }, []);

  return (
    <>
      <Navbar />
      <Toaster />
      <div className="blog-details-page">
        {/* ARTICLE HEADER */}

        <div className="article-header">
          <h1>{blog.title}</h1>

          <div className="article-meta">
            <div className="author">
              <div className="author-avatar">
                <Icon icon="solar:user-bold" />
              </div>

              <div>
                <h4>{blog.author}</h4>

                <p>
                  {blog.createdAt?.toDate().toLocaleDateString("en-AE", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>

            <span className="read-time">
              {contentDuration(blog.content)} min read
            </span>
          </div>
        </div>

        {/* ARTICLE CONTENT */}

        <article className="article-content">{blog.content}</article>

        {/* OWNER ACTIONS */}

        {user.user_id === blog.author_id && (
          <div className="article-actions">
            <Link to={"/blog/edit/" + blog_id} className="edit-btn-blog">
              <Icon icon="solar:pen-bold" />
              Edit Blog
            </Link>

            <button
              className="delete-btn-blog"
              onClick={() =>
                handleDeleteConfirmation(blog_id, setBlogs, blogs, navigate)
              }
            >
              <Icon icon="solar:trash-bin-trash-bold" />
              Delete Blog
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default BlogDetails;
