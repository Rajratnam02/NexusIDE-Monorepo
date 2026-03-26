import { Code2 } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && password) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="bg-[#0A0A0A] min-h-screen flex justify-center items-center px-4">
      <div className="bg-[#111111] border border-gray-800 w-full max-w-md rounded-2xl p-8 md:p-10 shadow-2xl">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-3 justify-center">
            <div
              onClick={() => {
                navigate("/");
              }}
              className="p-3 bg-blue-600 hover:rotate-12 transition-transform duration-300 w-fit rounded-2xl"
            >
              <Code2 className="text-white cursor-pointer w-6 h-6" />
            </div>
            <p
              onClick={() => {
                navigate("/");
              }}
              className="text-white text-xl cursor-pointer tracking-tight font-bold"
            >
              Nexus<span className="text-blue-600">IDE</span>
            </p>
          </div>
          <h1 className="text-3xl mt-5 font-bold text-white tracking-tight">
            Sign in
          </h1>
          <p className="text-slate-400 mt-2 text-sm">
            Sign in to continue to your workspace
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-10 space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 ml-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#0A0A0A] border border-gray-800 rounded-xl px-4 py-3 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 outline-none text-white font-mono placeholder:text-slate-700 transition-all"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 ml-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#0A0A0A] border border-gray-800 rounded-xl px-4 py-3 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 outline-none text-white font-mono placeholder:text-slate-700 transition-all"
              placeholder="••••••••"
              required
            />
          </div>

          <div className="pt-4 space-y-3">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3.5 rounded-xl font-bold text-lg transition-all transform active:scale-[0.98] shadow-lg shadow-blue-500/10"
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="w-full bg-transparent border border-transparent hover:bg-gray-900 text-slate-500 hover:text-slate-300 py-2 rounded-xl text-sm transition-all"
            >
              Don't have an account? Sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
