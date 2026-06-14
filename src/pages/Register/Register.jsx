import "./Register.css";
import { Icon } from "@iconify/react";
import { NavLink } from "react-router-dom";
import { auth,db, provider } from "../../firebase";
import { createUserWithEmailAndPassword ,signInWithPopup} from "firebase/auth";
import { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import toast, { Toaster } from "react-hot-toast";
const Register = () => {
    const [fullName,setFullName] = useState(null)
    const [email,setEmail] = useState(null)
    const [password,setPassword] = useState(null)
    const [showPassword,setShowPassword] = useState(false)

    function togglePasswordVisibility(){
        setShowPassword(!showPassword)
    }

    function signUpUser(e){
        e.preventDefault()
        
        if((fullName === null || fullName.trim() === "") || (email === null || email.trim() === "") || (password === null || password.trim() === "")){
            toast.error("All fields are required")
            return
        }

        
        createUserWithEmailAndPassword(auth,email,password)
        .then(async (userCredentials) => {
            const user = userCredentials.user
            await setDoc(doc(db,"users",user.uid),{
                name : fullName,
                email : user.email,
                isActive : true,
                createdAt : new Date()
            })
            toast('Welcome', { icon: '😊' })
        
        })
        .catch((error) => {
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

     function signUpWithGoogle(){
      signInWithPopup(auth, provider)
        .then(async (result) => {
          const user = result.user;
          await setDoc(doc(db,"users",user.uid),{
            name : user.displayName,
            email : user.email,
            isActive : true,
            createdAt : new Date()
        })
        toast('Welcome', { icon: '😊' })
         
        }).catch((error) => {
          toast.error(`Error: ${error.code || "Something went wrong, Try again"}`);
        });
    }

   return (
    <div className="register-page">

      {/* LEFT */}

      <div className="register-left">

        <div className="brand">

          <div className="brand-logo">
            <Icon icon="solar:pen-new-square-bold" />
          </div>

          <h1>InkFlow</h1>

          <p>
            Join a growing community of
            writers and creators.
          </p>

        </div>

        <div className="quote-card">

          <h3>
            Your next big idea deserves
            to be shared.
          </h3>

          <p>
            Create an account and start
            publishing stories today.
          </p>

        </div>

      </div>

      {/* RIGHT */}

      <div className="register-right">

        <div className="register-card">

          <h2>Create Account</h2>

          <p className="subtitle">
            Start your writing journey.
          </p>

          <form>

            <div className="form-group">

              <label>Full Name</label>

              <input
                type="text"
                placeholder="Enter your name"
                onChange={(e) => setFullName(e.target.value)}
              />

            </div>

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
              className="register-btn"
              onClick={signUpUser}
            >
              Create Account
            </button>

          </form>

          <div className="divider">
            <span>OR</span>
          </div>

          <button className="google-btn" onClick={signUpWithGoogle}>

            <Icon icon="logos:google-icon" />

            Continue with Google

          </button>

          <p className="login-text">

            Already have an account?

            <NavLink to='/login'  className="login-text-span">
                    
                    Login
                    
            </NavLink>

          </p>

        </div>

      </div>
      <Toaster />
    </div>
  );
};

export default Register;