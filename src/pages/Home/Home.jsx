import "./Home.css";
import Navbar from "../../components/Navbar/Navbar";
import BlogCard from "../../components/BlogCard/BlogCard";
import { useContext, useState } from "react";
import { AuthUser } from "../../contexts/AuthContext";
import { Toaster } from "react-hot-toast";
import EmptyState from "../../components/EmptyState/EmptyState";
import { BlogProvider } from "../../contexts/BlogProvider";

const Home = () => {
  const { user } = useContext(AuthUser);
  const { blogs, setBlogs } = useContext(BlogProvider);
  const [published, setPublished] = useState(true);
  const [drafted, setDrafted] = useState(false);

  

  const totalViews = useMemo(() => {
    if (!user?.user_id || !blogs) return "0";

    const calcViews = blogs
      .filter((blog) => blog.author_id === user.user_id && !blog.isDrafted)
      .reduce((acc, curr) => acc + (curr.views || 0), 0);

    return new Intl.NumberFormat("en", {
      notation: "compact",
      compactDisplay: "short",
    }).format(calcViews);
  }, [blogs, user]);


  const hour = new Date().getHours();

  return (
    <>
      <Navbar />

      <div className="dashboard">
        {/* HERO */}

        <section className="hero">
          <div>
            <h1>
              {hour < 12
                ? "Good Morning"
                : hour >= 12 && hour <= 16
                ? "Good Afternoon"
                : "Good Evening"}
              👋
            </h1>

            <p>Welcome back to InkFlow. Share your ideas with the world.</p>
          </div>
        </section>

        {/* STATS */}

        <section className="stats-grid">
          <div className="stat-card">
            <h2>
              {blogs.length &&
                blogs.filter((blog) => blog && blog.author_id === user.user_id)
                  .length}
            </h2>

            <p>Total Blogs</p>
          </div>

          <div className="stat-card">
            <h2>
              {blogs.length &&
                blogs.filter(
                  (blog) =>
                    blog && blog.author_id === user.user_id && blog.isDrafted
                ).length}
            </h2>

            <p>Draft Posts</p>
          </div>

          <div className="stat-card">
            <h2>{totalViews}</h2>

            <p>Total Views</p>
          </div>
        </section>

        <section>
          <div className="blogs-switch">
            <button
              className={published ? "active" : null}
              style={{ marginLeft: "2px" }}
              onClick={() => {
                setPublished(!published);
                setDrafted(!drafted);
              }}
            >
              Published
            </button>
            <button
              className={drafted ? "active" : null}
              style={{ marginRight: "2px" }}
              onClick={() => {
                setPublished(!published);
                setDrafted(!drafted);
              }}
            >
              Drafted
            </button>
          </div>
        </section>

        <section className="blogs-section">
          <div className="section-title">
            <h2>Blogs</h2>
          </div>

          <div className="blog-grid">
            {blogs.length > 0 &&
            blogs.filter(
              (blog) =>
                user.user_id === blog.author_id && blog.isDrafted !== published
            ).length ? (
              blogs.map((blog) => {
                if (
                  user.user_id === blog.author_id &&
                  published !== blog.isDrafted
                ) {
                  return (
                    <BlogCard
                      key={blog.blog_id}
                      title={blog.title}
                      content={blog.content}
                      author={blog.author}
                      author_id={blog.author_id}
                      date={blog.createdAt
                        .toDate()
                        .toLocaleDateString("en-AE", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })}
                      blog_id={blog.blog_id}
                      setBlogs={setBlogs}
                      blogs={blogs}
                    />
                  );
                }
              })
            ) : (
              <EmptyState />
            )}
          </div>
        </section>
        <Toaster />
      </div>
    </>
  );
};

export default Home;
