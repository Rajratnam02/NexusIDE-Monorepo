import React from "react";
import { useNavigate } from "react-router-dom";
import { Code2 } from "lucide-react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../configs/firebase";
import GoogleIcon from "../../public/GoogleIcon";
import Logo from "../../public/Logo";

const Login = () => {
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      const response = await signInWithPopup(auth, googleProvider);
      const user = response.user;

      console.log("User Info:", user);

      navigate("/dashboard");
    } catch (error) {
      console.log("Auth Error:", error.code, error.message);
    }
  };

  return (
    <div className="bg-[#0A0A0A] min-h-screen flex justify-center items-center px-4">
      <div className="bg-[#111111]  border border-gray-800 w-full max-w-md rounded-3xl p-8 md:p-12 shadow-[0_0_50px_-12px_rgba(37,99,235,0.1)]">
        <Logo />
        <div className="flex flex-col items-center">
          <h1 className="text-white text-center mt-6 font-bold text-3xl tracking-tight">
            Welcome Back
          </h1>
          <p className="text-slate-500 text-center mt-2 text-sm max-w-62.5">
            Continue coding and collaborate in real-time.
          </p>
        </div>
        <div className="mt-10 space-y-4">
          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-black py-3.5 rounded-xl font-bold text-md transition-all transform active:scale-[0.98] shadow-xl"
          >
            <GoogleIcon />
            Continue with Google
          </button>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="w-full bg-[#1A1A1A] border border-gray-800 hover:border-gray-700 text-slate-400 hover:text-white py-3 rounded-xl text-sm font-medium transition-all"
          >
            Return
          </button>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-800/30 text-center">
          <p className="text-slate-500 text-xs">
            By signing in, you agree to our
            <span className="text-blue-500 cursor-pointer hover:underline ml-1">
              Terms of Service
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
