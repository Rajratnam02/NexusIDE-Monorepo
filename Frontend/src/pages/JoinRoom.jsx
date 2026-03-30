import React, { useState } from "react";
import { LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Logo from "../../public/Logo";

const JoinRoom = () => {
  const navigate = useNavigate();
  const [roomIdValue, setRoomIdValue] = useState("");
  const [name, setName] = useState("");

  const newRoomId = () => {
    const characters = "abcdefghijklmnopqrstuvwxyz1234567890";
    const generatePart = () => {
      let a = "";
      for (let i = 0; i < 3; i++) {
        a = a + characters[Math.floor(Math.random() * 36)];
      }
      return a;
    };
    const roomId = `${generatePart()}-${generatePart()}-${generatePart()}`;

    setRoomIdValue(roomId);
  };

  const changeHandler = (e) => {
    setRoomIdValue(e.target.value);
  };

  const changeName = (e) => {
    setName(e.target.value);
  };

  const enterRoom = (e) => {
    e.preventDefault();

    if (name && roomIdValue) {
      navigate(`/room/${roomIdValue}`, {
        state: { name },
      });
    }
  };

  return (
    <div className="bg-[#0A0A0A] min-h-screen flex justify-center items-center px-4">
      <div className="bg-[#111111] border border-gray-800 w-full max-w-md rounded-2xl p-8 md:p-10 shadow-2xl">
        <div className="flex flex-col items-center text-center">
          <Logo />
          <h1 className="text-3xl mt-6 font-bold text-white tracking-tight">
            Join a Session
          </h1>
          <p className="text-slate-400 mt-2 text-sm">
            Enter a Room ID to start collaborating
          </p>
        </div>

        <form onSubmit={enterRoom} className="mt-10 space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 ml-1">
              Room ID
            </label>
            <div className="flex gap-2">
              <input
                onChange={changeHandler}
                value={roomIdValue}
                className="flex-1 bg-[#0A0A0A] border border-gray-800 rounded-xl px-4 py-3 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 outline-none text-white font-mono placeholder:text-slate-700 transition-all"
                type="text"
                placeholder="e.g. x8j-2kf-9ps"
                required
              />
              <button
                onClick={newRoomId}
                type="button"
                className="px-4 bg-[#1a1a1a] border border-gray-800 hover:border-blue-500/50 rounded-xl text-xs font-bold text-blue-400 uppercase tracking-wider transition-all active:scale-95"
              >
                New
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 ml-1">
              Your Name
            </label>
            <input
              onChange={changeName}
              value={name}
              className="w-full bg-[#0A0A0A] border border-gray-800 rounded-xl px-4 py-3 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 outline-none text-white font-mono placeholder:text-slate-700 transition-all"
              type="text"
              placeholder="How should others see you?"
              required
            />
          </div>

          <div className="pt-4 space-y-3">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3.5 rounded-xl font-bold text-lg transition-all transform active:scale-[0.98] shadow-lg shadow-blue-500/10"
            >
              Enter Room
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              type="button"
              className="w-full bg-transparent border border-transparent hover:bg-gray-900 text-slate-500 hover:text-slate-300 py-2 rounded-xl text-sm transition-all"
            >
              Back to Dashboard
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JoinRoom;
