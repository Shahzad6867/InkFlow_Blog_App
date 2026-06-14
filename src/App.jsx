import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import BlogForm from "./pages/BlogForm/BlogForm";
import Register from "./pages/Register/Register";
import NotFound from "./pages/NotFound/NotFound";
import BlogList from "./pages/BlogList/BlogList";
import BlogDetails from "./pages/BlogDetails/BlogDetails";
import { useEffect, useState } from "react";
import { AuthUser } from "./contexts/AuthContext";
import { onAuthStateChanged } from "firebase/auth";
import ProtectRoute from "./components/ProtectRoute";
import RestrictRoute from "./components/RestrictRoute";
import { auth, db } from "./firebase";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import Loader from "./pages/Loader/Loader";
import { BlogProvider } from "./contexts/BlogProvider";
function App() {
  const [user, setUser] = useState(null);
  const [loader, setLoader] = useState(true);
  const [blogs, setBlogs] = useState([]);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser !== null) {
        const docSnap = await getDoc(doc(db, "users", currentUser?.uid));
        const user = docSnap.exists() ? docSnap.data() : null;
        user.user_id = docSnap.id;
        setUser(user);
      }
      setLoader(false);

      async function getBlogs() {
        const docSnaps = await getDocs(collection(db, "blogs"));
        const fetchedBlogs = [];
        docSnaps.forEach((doc) => {
          const data = doc.data();
          fetchedBlogs.push({ ...data, blog_id: doc.id });
        });
        setBlogs(fetchedBlogs);
      }
      getBlogs();
    });

    return () => unsubscribe();
  }, []);
  return (
    <AuthUser value={{ user, setUser, loader }}>
      <BlogProvider value={{ blogs, setBlogs }}>
        <Loader loader={loader} />
        <Routes>
          <Route
            path="/"
            element={
              <ProtectRoute>
                <BlogList />
              </ProtectRoute>
            }
          />
          <Route
            path="/home"
            element={
              <ProtectRoute>
                <Home />
              </ProtectRoute>
            }
          />
          <Route
            path="/blog/:blog_id"
            element={
              <ProtectRoute>
                <BlogDetails />
              </ProtectRoute>
            }
          />

          <Route
            path="/login"
            element={
              <RestrictRoute>
                <Login />
              </RestrictRoute>
            }
          />
          <Route
            path="/register"
            element={
              <RestrictRoute>
                <Register />
              </RestrictRoute>
            }
          />
          <Route
            path="/blog/new"
            element={
              <ProtectRoute>
                <BlogForm formTitle="Create New" formBtnTitle="Publish" />
              </ProtectRoute>
            }
          />
          <Route
            path="/blog/edit/:blog_id"
            element={
              <ProtectRoute>
                <BlogForm formTitle="Edit" formBtnTitle="Update" />
              </ProtectRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BlogProvider>
    </AuthUser>
  );
}

export default App;
