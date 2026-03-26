import { ActivityIcon } from "lucide-react";
import React from "react";
import RecentCard from "./RecentCard";

const RecentActivities = () => {
  const activitiesData = [
    {
      id: 1,
      type: "CREATED",
      user: "You",
      project: "WheelSync-Backend",
      description: "Initialized new repository",
      time: "2m ago",
      isTerminal: true,
    },
    {
      id: 2,
      type: "PUSHED",
      user: "You",
      project: "Nexus-IDE-Core",
      description: "Updated socket.io handler logic",
      time: "1h ago",
      isTerminal: true,
    },
    {
      id: 3,
      type: "JOINED",
      user: "Alex Rivera",
      project: "Nexus-IDE-Core",
      description: "Joined the collaboration session",
      time: "3h ago",
      isTerminal: false,
    },
    {
      id: 4,
      type: "EXECUTED",
      user: "You",
      project: "Algorithm-Visualizer",
      description: "Compiled main.cpp successfully",
      time: "Yesterday",
      isTerminal: true,
    },
    {
      id: 5,
      type: "DELETED",
      user: "You",
      project: "Old-Test-Files",
      description: "Removed deprecated test suite",
      time: "2 days ago",
      isTerminal: false,
    },
  ];

  return (
    <div className="flex-1 pb-7 flex-col flex ">
      <div className="flex mx-15 mt-15 items-end justify-between">
        <div>
          <div className="flex items-center gap-1.5">
            <ActivityIcon className="text-blue-600" />
            <p className="text-3xl font-bold tracking-tight">Recent Activity</p>
          </div>
          <p className="text-gray-400 mt-1">
            Real-time log of your workspace events and collaborations
          </p>
        </div>
      </div>
      {/* APPLY MAPPING HERE */}
      <div className="pl-15">
        {activitiesData.map((data) => (
          <RecentCard data={data} />
        ))}
      </div>
    </div>
  );
};

export default RecentActivities;
