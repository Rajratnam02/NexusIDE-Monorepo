import React from "react";
import Logo from "../../public/Logo";
import GoogleIcon from "../../public/GoogleIcon";
import { useNavigate } from "react-router-dom";
import { auth, googleProvider } from "../configs/firebase";
import { signInWithPopup } from "firebase/auth";

const Register = () => {
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    try {
      e.preventDefault();

      const response = await signInWithPopup(
        auth,
        googleProvider
      );

      console.log(response.user);

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="bg-[#0A0A0A] min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8">

      <div className="w-full max-w-sm sm:max-w-md bg-[#111111] border border-gray-800 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 lg:p-12 shadow-[0_0_50px_-12px_rgba(37,99,235,0.1)]">

        <div className="flex flex-col text-center">

          {/* Logo */}
          <div className="flex justify-center">
            <Logo />
          </div>

          {/* Heading */}
          <div className="flex flex-col items-center mt-5">

            <h1 className="text-white font-bold text-2xl sm:text-3xl tracking-tight">
              Sign Up
            </h1>

            <p className="text-slate-500 text-sm sm:text-base mt-3 max-w-xs leading-relaxed">
              Start coding in real-time.
            </p>

          </div>

          {/* Google Button */}
          <button
            onClick={handleSignUp}
            className="w-full mt-8 flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-black py-3.5 px-4 rounded-xl font-bold text-sm sm:text-base transition-all active:scale-[0.98] shadow-xl"
          >
            <GoogleIcon />
            Continue with Google
          </button>

          {/* Return Button */}
          <button
            onClick={() => navigate("/")}
            className="w-full mt-4 bg-[#1A1A1A] border border-gray-800 hover:border-gray-700 text-slate-400 hover:text-white py-3 px-4 rounded-xl text-sm font-medium transition-all"
          >
            Return
          </button>

          {/* Footer */}
          <div className="mt-8 sm:mt-10 pt-6 border-t border-gray-800/40 text-center">

            <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
              By signing up, you agree to our

              <span className="text-blue-500 cursor-pointer hover:underline ml-1">
                Terms of Service
              </span>

            </p>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Register;