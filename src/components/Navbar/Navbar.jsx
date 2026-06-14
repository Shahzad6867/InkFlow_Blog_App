import "./Navbar.css";
import { Icon } from "@iconify/react";
import { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthUser } from "../../contexts/AuthContext";
import toast from "react-hot-toast";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { useTheme } from "../../contexts/ThemeContext";

const Navbar = () => {
  const [showMenu,setShowMenu] = useState(false)
  const {user,setUser} = useContext(AuthUser)
  const {theme,toggleTheme} = useTheme()
  const navigate = useNavigate()

  async function logoutUser(){
    await signOut(auth)
    setUser(null)
    navigate("/login")
    toast('See you next time!', { icon: '👋' })
  }

  return (
    <nav className="navbar">

      <div className="navbar-left">

        <div className="logo">

          <div className="logo-box">
            <Icon icon="solar:pen-new-square-bold" />
          </div>

          <h2>InkFlow</h2>

        </div>

        <div className="nav-links">

          <NavLink to="/home">
            Home
          </NavLink>
          <NavLink to="/">
            Explore
          </NavLink>

        </div>

      </div>

      <div className="navbar-right">

        {!user ? (
          <>
            <NavLink
              to="/login"
              className="login-link"
              state={{path : location.pathname}}
            >
              Login
            </NavLink>

            <NavLink
              to="/register"
              className="register-btn"
            >
              Register
            </NavLink>
          </>
        ) : (
          <>

            <NavLink to='/blog/new' className="create-btn" state={{path : location.pathname}}>

              <Icon icon="solar:add-circle-bold" />

              Create Blog

            </NavLink>

            <div className="profile-wrapper">

            <div
              className="profile"
              onClick={() => setShowMenu(!showMenu)}
            >
              <Icon icon="solar:user-bold" />
            </div>
           

            {showMenu && (
              <div className="profile-dropdown">

                <div className="dropdown-user">
                  <p>Account</p>

                  <h4>{user.name}</h4>

                </div>
                <div className="theme-toggle">

                  <span>
                    Dark Mode
                  </span>

                  <label className="switch">

                    <input
                      type="checkbox"
                      checked={theme === "dark"}
                      onChange={toggleTheme}
                    />

                    <span className="slider"></span>

                  </label>

                </div>
                <button className="logout-item" onClick={logoutUser}>
                  Logout
                </button>

              </div>
            )}

          </div>

          </>
        )}

      </div>

    </nav>
  );
};

export default Navbar;