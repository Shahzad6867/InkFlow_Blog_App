import "./BlogList.css";
import Navbar from "../../components/Navbar/Navbar";
import BlogCard from "../../components/BlogCard/BlogCard";
import { useContext } from "react";
import {Toaster} from "react-hot-toast";
import EmptyState from "../../components/EmptyState/EmptyState";
import { BlogProvider } from "../../contexts/BlogProvider";

const BlogList = () => {
  const {blogs,setBlogs} = useContext(BlogProvider)
  return (
    <>
      <Navbar />
      <Toaster />
      <div className="home-page">

        {/* HERO */}

        <section className="hero-section">

          <span className="hero-badge">
            ✨ Welcome to InkFlow
          </span>

          <h1>
            Discover Stories
            That Matter
          </h1>

          <p>
            Explore tutorials, experiences,
            ideas and insights shared by
            passionate writers.
          </p>


        </section>

        

        {/* BLOGS */}

        <section className="feed-section">

          <div className="section-header">

            <h2>Latest Stories</h2>

            <span>{blogs.length} Articles</span>

          </div>

          <div className="feed-grid">
            {blogs.length > 0 ? 
            blogs.map(blog => (
              <BlogCard
              key={blog.blog_id}
              title={blog.title}
              content={blog.content}
              author={blog.author}
              author_id={blog.author_id}
              date={blog.createdAt.toDate().toLocaleDateString("en-AE",{day : "2-digit",month : "long",year : "numeric"})}
              blog_id={blog.blog_id}
              setBlogs={setBlogs}
              blogs={blogs}
            />
            )) : (
              <EmptyState />
            ) }
            

          </div>

        </section>

      </div>
    </>
  );
};

export default BlogList;