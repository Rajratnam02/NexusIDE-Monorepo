import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../public/Logo";

const JoinRoom = () => {

  const navigate = useNavigate();

  const [roomIdValue, setRoomIdValue] =
    useState("");

  const changeHandler = (e) => {
    setRoomIdValue(e.target.value);
  };

  const enterRoom = (e) => {
    e.preventDefault();

    const roomId = roomIdValue.trim();

    if (roomId) {
      navigate(`/room/${roomId}`);
    }
  };

  return (
    <div className="bg-[#0A0A0A] min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8">

      <div className="w-full max-w-sm sm:max-w-md bg-[#111111] border border-gray-800 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 shadow-[0_0_50px_-12px_rgba(37,99,235,0.1)]">

        {/* Header */}
        <div className="flex flex-col items-center text-center">

          <Logo />

          <h1 className="text-2xl sm:text-3xl mt-5 sm:mt-6 font-bold text-white tracking-tight">
            Join a Session
          </h1>

          <p className="text-slate-400 mt-3 text-sm sm:text-base max-w-xs leading-relaxed">
            Enter a Room ID to start collaborating
          </p>

        </div>

        {/* Form */}
        <form
          onSubmit={enterRoom}
          className="mt-8 sm:mt-10 space-y-6"
        >

          <div>

            <label className="block text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 ml-1">

              Room ID

            </label>

            <input
              onChange={changeHandler}
              value={roomIdValue}
              className="
                w-full
                bg-[#0A0A0A]
                border
                border-gray-800
                rounded-xl
                px-4
                py-3
                text-sm sm:text-base
                text-white
                font-mono
                placeholder:text-slate-700
                outline-none
                transition-all
                focus:border-blue-500/50
                focus:ring-1
                focus:ring-blue-500/50
              "
              type="text"
              placeholder="Enter Project Room ID..."
              required
            />

          </div>

          {/* Buttons */}
          <div className="pt-2 space-y-3">

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 sm:py-3.5 rounded-xl font-bold text-base sm:text-lg transition-all active:scale-[0.98] shadow-lg shadow-blue-500/10"
            >

              Enter Room

            </button>

            <button
              type="button"
              onClick={() => navigate("/")}
              className="w-full bg-[#1A1A1A] border border-gray-800 hover:border-gray-700 text-slate-400 hover:text-white py-3 rounded-xl text-sm font-medium transition-all"
            >

              Return

            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default JoinRoom;