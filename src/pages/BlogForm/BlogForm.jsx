import "./BlogForm.css";
import Navbar from "../../components/Navbar/Navbar";
import { Icon } from "@iconify/react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { addDoc, collection, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { AuthUser } from "../../contexts/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import { BlogProvider } from "../../contexts/BlogProvider";

const BlogForm = ({ formTitle, formBtnTitle }) => {
  const navigate = useNavigate();
  const origin = useLocation();
  const { user } = useContext(AuthUser);
  const { blogs,setBlogs } = useContext(BlogProvider);
  const [title, setTitle] = useState(null);
  const [content, setContent] = useState(null);
  const [isDrafted, setIsDrafted] = useState(true);
  const [reset, setReset] = useState("");
  const params = useParams();
  const { blog_id } = params;

  useEffect(() => {
    if (blog_id) {
      async function getBlog() {
        const docSnap = await getDoc(doc(db, "blogs", blog_id));
        const blog = docSnap.data();
        setTitle(blog.title);
        setContent(blog.content);
        setIsDrafted(blog.isDrafted);
      }
      getBlog();
    } else {
      setTitle(null);
      setContent(null);
      setIsDrafted(true);
    }
  }, [blog_id]);

  async function getBlogs() {
    const docSnaps = await getDocs(collection(db, "blogs"));
    const fetchedBlogs = [];
    docSnaps.forEach((doc) => {
      const data = doc.data();
      fetchedBlogs.push({ ...data, blog_id: doc.id });
    });
    setBlogs(fetchedBlogs);
  }

  function validateBlog(){
    if (title === null || !title.trim()) throw new Error("Title is required");
    if (title.length < 10) throw new Error("Title must be at least 10 characters");
    if (title.length > 100) throw new Error("Title cannot exceed 100 characters");
    if (content === null || !content.trim()) throw new Error("Content is required");
    if (content.length < 100) throw new Error("Content should be at least 100 characters");
  }

  async function createBlog(isDrafted) {
    if(!isDrafted){
      validateBlog()
    }else{
      if (title === null || !title.trim()) throw new Error("Title is required");
      if (content === null || !content.trim()) throw new Error("Content is required");
    }
     
     await addDoc(collection(db, "blogs"), {
      title,
      content,
      author: user.name,
      author_id: user.user_id,
      views : 0,
      isDrafted: isDrafted,
      createdAt: new Date(),
    });
  }

  async function updateBlog() {
    if(!isDrafted){
      validateBlog()
    }else{
      if (title === null || !title.trim()) throw new Error("Title is required");
      if (content === null || !content.trim()) throw new Error("Content is required");
    }
    await updateDoc(doc(db, "blogs", blog_id), {
      title,
      content,
      createdAt: new Date(),
    });
  }

  async function updateDraftBlog() {
    validateBlog()
    await updateDoc(doc(db, "blogs", blog_id), {
      title,
      content,
      createdAt: new Date(),
      views: 0,
      isDrafted: false,
    });
  }

  return (
    <>
      <Navbar />
      <Toaster />
      <div className="form-page">
        {/* HEADER */}

        <div className="form-header">
          <button
            onClick={() => navigate(origin?.state?.path || "/")}
            className="back-btn"
          >
            <Icon icon="solar:arrow-left-bold" />
            Back
          </button>

          <h1>{formTitle} Blog</h1>
        </div>

        {/* FORM CARD */}

        <div className="form-card">
          {/* TITLE */}

          <div className="field">
            <label>Title</label>

            <input
              type="text"
              placeholder="Enter blog title..."
              value={title || ""}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* CONTENT */}

          <div className="field">
            <label>Content</label>

            <textarea
              value={content || ""}
              placeholder="Write your story here..."
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          {/* ACTIONS */}

          <div className="actions">
            {!blog_id && (
              <button
                className="draft-btn"
                onClick={() => {
                  toast.promise(createBlog(true),{
                    loading : "Saving draft",
                    success: 'Draft saved successfully!',
                    error: (err) => err.message || 'Failed to save draft'
                  })
                  .then(() => {
                    getBlogs()
                    navigate("/home")
                  })
                }}
              >
                Save Draft
              </button>
            )}

            <button
              className={isDrafted && blog_id ? "draft-btn" : "publish-btn"}
              onClick={() => {
                const operation = (isDrafted && !blog_id) ? createBlog(false) : updateBlog();
                
                toast.promise(operation, {
                  loading: isDrafted && !blog_id ? 'Publishing blog...' : "Saving blog...",
                  success: isDrafted && !blog_id ? 'Blog published successfully!' : 'Blog saved successfully!',
                  error: (err) => err.message || "Failed"
                })
                .then(() => {
                  getBlogs()
                  navigate("/home")
                })
              }}
            >
              {formBtnTitle} Blog
            </button>

            {isDrafted && blog_id ? (
              <button
                className="publish-btn"
                onClick={() => {
                  toast.promise(updateDraftBlog(), {
                    loading: 'Publishing blog...',
                    success: 'Blog published successfully!',
                    error: (err) => err.message || 'Failed to publish blog'
                  })
                  .then(() => {
                    getBlogs()
                    navigate("/home")
                  })
                }}
              >
                Publish Blog
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogForm;
