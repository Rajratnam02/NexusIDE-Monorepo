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
      const response = await signInWithPopup(auth, googleProvider);
      const user = response.user;
      console.log(user);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="bg-[#0A0A0A] min-h-screen flex justify-center items-center px-4">
      <div className="bg-[#111111] border border-gray-800 w-full max-w-md rounded-3xl p-8 md:p-12 shadow-[0_0_50px_-12px_rgba(37,99,235,0.1)]">
        <div className="flex flex-col text-center  border-white">
          <Logo />
          <div className="flex flex-col items-center  border-white">
            <h1 className="text-white text-center mt-6 font-bold text-3xl tracking-tight">
              Sign Up
            </h1>
            <p className="text-slate-500 text-center mt-2 text-sm max-w-62.5">
              Start coding in real-time.
            </p>
          </div>

          <div
            onClick={handleSignUp}
            className="w-full mt-6 cursor-pointer flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-black py-3.5 rounded-xl font-bold text-md transition-all transform active:scale-[0.98] shadow-xl"
          >
            <GoogleIcon />
            Continue with Google
          </div>

          <div
            onClick={() => {
              navigate("/");
            }}
            className="bg-[#1A1A1A] border mt-4 cursor-pointer border-gray-800 hover:border-gray-700 text-slate-400 hover:text-white py-3 rounded-xl text-sm font-medium transition-all"
          >
            Return
          </div>

          <div className="mt-10 pt-6 border-t border-gray-800/30 text-center">
            <p className="text-slate-500 text-xs">
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
