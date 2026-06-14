import "./Login.css";
import { Icon } from "@iconify/react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, db, provider } from "../../firebase";
import {AuthUser} from "../../contexts/AuthContext";
import { doc, getDoc, setDoc } from "firebase/firestore";
import toast, { Toaster } from "react-hot-toast";

const Login = () => {

    const {setUser} = useContext(AuthUser)
    const [email,setEmail] = useState(null)
    const [password,setPassword] = useState(null)
    const [showPassword,setShowPassword] = useState(false)
    const origin = useLocation()
    const navigate = useNavigate()

    
    function togglePasswordVisibility(){
        setShowPassword(!showPassword)
    }
    function signInUser(e){
        e.preventDefault()
        if((email === null || email.trim() === "") || (password === null || password.trim() === "")){
            toast.error("All fields are required")
            return
        }
        signInWithEmailAndPassword(auth,email,password)
        .then(async (userCredentials) => {
            const docSnap = await getDoc(doc(db,"users",userCredentials.user.uid))
            const user = docSnap.exists() ? docSnap.data() : null
            user.user_id = docSnap.id
            setUser(user)
            navigate(origin?.state?.path || "/home")
            toast('Welcome', { icon: '😊' })
        })
        .catch(error => {
            console.log(error.code)
            console.log(error.message)

            switch(error.code){
              case 'auth/invalid-credential':
                 toast.error("Incorrect email or password!",{position : "top-center"})
               break;

               case 'auth/weak-password':
                 toast.error("Password should be at least 6 characters",{position : "top-center"})
               break;

               case "auth/invalid-email":
                 toast.error("Invalid email format",{position : "top-center"})
               break;

               default :
               toast.error("Something went wrong, Try again")
               break;
          }
        })

    }

    function signInWithGoogle(){
      signInWithPopup(auth,provider)
      .then(async (result) => {
        const docSnap = await getDoc(doc(db,"users",result.user.uid))
       
        if(!docSnap.exists()){
          await setDoc(doc(db,"users",result.user.uid),{
            name : result.user.displayName,
            email : result.user.email,
            isActive : true,
            createdAt : new Date()
         })
        }
        let user = docSnap && docSnap.exists() ? docSnap.data() : null
        user.user_id = user ? docSnap.id : null
        if(!user){
          user = {
            name : result.user.displayName,
            email : result.user.email,
            user_id : result.user.uid
          }
        }
        setUser(user)
        navigate(origin?.state?.path || "/home")
        toast('Welcome', { icon: '😊' })
      })
      .catch(error => {
        toast.error(`Error: ${error.code || "Something went wrong, Try again"}`);
      })
    }
  return (
    <div className="login-page">
        
      {/* LEFT SECTION */}

      <div className="login-left">

        <div className="brand">

          <div className="brand-logo">
            <Icon icon="solar:pen-new-square-bold" />
          </div>

          <h1>InkFlow</h1>

          <p>
            Write. Share. Inspire.
          </p>

        </div>

        <div className="quote-card">

          <h3>
            Every great story starts
            with a single idea.
          </h3>

          <p>
            Build your personal space
            for thoughts, tutorials and
            creativity.
          </p>

        </div>

      </div>

      {/* RIGHT SECTION */}

      <div className="login-right">

        <div className="login-card">

          <h2>Welcome Back</h2>

          <p className="subtitle">
            Sign in to continue writing.
          </p>

          <form>

            <div className="form-group">

              <label>Email Address</label>

              <input
                type="email"
                placeholder="Enter your email"
                onChange={(e) => setEmail(e.target.value)}
              />

            </div>

           <div className="form-group" style={{ marginBottom : "30px"}}>

              <label>Password</label>

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Create password"
                onChange={(e) => setPassword(e.target.value)}
                
              />

                <span onClick={togglePasswordVisibility} className="toggle-eye">
                    <Icon icon={showPassword ? "lucide:eye" : "lucide:eye-off"} />
                </span>

            </div>

            <button
              type="submit"
              className="login-btn"
              onClick={signInUser}
            >
              Sign In
            </button>

          </form>

          <div className="divider">
            <span>OR</span>
          </div>

          <button className="google-btn" onClick={signInWithGoogle}>

            <Icon icon="logos:google-icon" />

            Continue with Google

          </button>

          <p className="register-text">

            Don't have an account?

            <NavLink to='/register'  className="register-text-span">
                    
                    Register
                    
            </NavLink>

          </p>

        </div>

      </div>
      <Toaster />
    </div>
  );
};

export default Login;