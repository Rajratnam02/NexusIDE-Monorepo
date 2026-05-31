import React from "react";
import Navbar from "../components/Navbar";
import { Shield, Terminal, Users, Zap } from "lucide-react";
import FeatureCard from "../components/FeatureCard";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-[#0A0A0A] min-h-screen text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 md:pt-20 pb-20 text-center flex flex-col items-center">

        <div className="max-w-4xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 tracking-tight leading-tight">
            Code together,
            <br />
            <span className="text-blue-600">
              anywhere in real-time.
            </span>
          </h1>

          <p className="text-gray-400 text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            The collaborative IDE built for speed. Pair program,
            debug, and ship code with your team in a powerful,
            sandboxed environment.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto">

          <button
            onClick={() => navigate("/join")}
            className="w-full sm:w-auto px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
          >
            <Users size={20} />
            Join a Room
          </button>

          <button
            onClick={() => navigate("/dashboard")}
            className="w-full sm:w-auto px-8 py-4 bg-[#1E2939] text-white font-bold rounded-xl hover:bg-[#28374d] transition-all"
          >
            Create New Project
          </button>

        </div>
      </section>

      {/* IDE Preview Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">

        <div className="overflow-hidden rounded-xl">

          <div className="bg-[#252525] border border-gray-800 h-12 rounded-t-xl px-5 flex justify-between items-center">

            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-red-500/50"></div>
              <div className="h-3 w-3 rounded-full bg-yellow-500/50"></div>
              <div className="h-3 w-3 rounded-full bg-green-500/50"></div>
            </div>

            <p className="text-[10px] sm:text-xs text-gray-500 font-mono italic truncate">
              NexusIDE - main.py
            </p>

            <div></div>
          </div>

          <div className="bg-[#1E1E1E] border border-gray-800 border-t-0 rounded-b-xl min-h-[220px] sm:min-h-[260px]">

            <div className="px-4 sm:px-8 md:px-10 py-5 text-sm sm:text-base overflow-x-auto">

              <p className="text-blue-500">
                import <span className="text-white">nexus</span>
              </p>

              <p className="text-gray-400 mt-3">
                <span className="text-purple-400">def </span>

                <span className="text-yellow-300">
                  collaborate
                </span>

                (team):
              </p>

              <p className="text-gray-400 ml-4 sm:ml-6">
                <span className="text-purple-400">
                  return
                </span>{" "}
                team.sync_realtime()
              </p>

              <p className="mt-6 text-gray-400">
                // User "Alex" joined the room...
              </p>

              <p className="text-gray-400">
                // User "Sarah" is typing!!
              </p>

            </div>
          </div>

        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 mt-16 border-t border-gray-900">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

          <FeatureCard
            icon={<Zap className="text-yellow-500" />}
            title="Ultra-Low Latency"
            desc="Powered by Socket.IO for sub-50ms synchronization across all connected peers."
          />

          <FeatureCard
            icon={<Shield className="text-green-500" />}
            title="Isolated Execution"
            desc="Run your C++, JS, and Python code securely inside Dockerized sandboxes."
          />

          <FeatureCard
            icon={<Terminal className="text-blue-500" />}
            title="Integrated Terminal"
            desc="Full output console support to see execution results and debug logs instantly."
          />

        </div>
      </section>

    </div>
  );
};

export default Landing;