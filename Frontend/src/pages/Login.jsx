import React from "react";
import { useNavigate } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../configs/firebase";
import GoogleIcon from "../../public/GoogleIcon";
import Logo from "../../public/Logo";

const Login = () => {
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      const response = await signInWithPopup(auth, googleProvider);

      console.log("User Info:", response.user);

      navigate("/dashboard");
    } catch (error) {
      console.log("Auth Error:", error.code, error.message);
    }
  };

  return (
    <div className="bg-[#0A0A0A] min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8">

      <div className="w-full max-w-sm sm:max-w-md bg-[#111111] border border-gray-800 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 lg:p-12 shadow-[0_0_50px_-12px_rgba(37,99,235,0.1)]">

        {/* Logo */}
        <div className="flex justify-center">
          <Logo />
        </div>

        {/* Heading */}
        <div className="flex flex-col items-center mt-5">

          <h1 className="text-white text-center font-bold text-2xl sm:text-3xl tracking-tight">
            Welcome Back
          </h1>

          <p className="text-slate-500 text-center mt-3 text-sm sm:text-base max-w-xs leading-relaxed">
            Continue coding and collaborate in real-time.
          </p>

        </div>

        {/* Buttons */}
        <div className="mt-8 sm:mt-10 space-y-4">

          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-black py-3.5 px-4 rounded-xl font-bold text-sm sm:text-base transition-all active:scale-[0.98] shadow-xl"
          >
            <GoogleIcon />
            Continue with Google
          </button>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="w-full bg-[#1A1A1A] border border-gray-800 hover:border-gray-700 text-slate-400 hover:text-white py-3 px-4 rounded-xl text-sm font-medium transition-all"
          >
            Return
          </button>

        </div>

        {/* Footer */}
        <div className="mt-8 sm:mt-10 pt-6 border-t border-gray-800/40 text-center">

          <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
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