import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import DashboardNavbar from "../components/DashboardNavbar";
import Projects from "../components/Projects";
import SharedWithMe from "../components/SharedWithMe";
import RecentActivities from "../components/RecentActivities";

const Dashboard = () => {
  const [selected, setSelected] = useState("Projects");
  const [closed, setClosed] = useState(false);

  return (
    <div className="bg-[#0A0A0A] text-white min-h-screen flex relative overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        closed={closed}
        setClosed={setClosed}
        selected={selected}
        setSelected={setSelected}
      />

      {/* Main Content */}
      <div
        className={`
          flex flex-1 flex-col transition-all duration-500 md:ml-[280px]
          ${closed ? "md:ml-[90px]" : ""}
        `}
      >
        <DashboardNavbar closed={closed} setClosed={setClosed} />

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-5 overflow-y-auto">
          {selected === "Projects" && <Projects />}

          {selected === "Shared with me" && <SharedWithMe />}

          {selected === "Recent" && <RecentActivities />}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
