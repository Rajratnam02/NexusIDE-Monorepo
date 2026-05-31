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
    <div className="flex-1 flex flex-col pb-7">
      {/* Header */}
      <div className="px-4 sm:px-6 lg:px-10 mt-8 lg:mt-12">
        <div className="flex items-center gap-2">
          <ActivityIcon className="text-blue-600" />

          <p className="text-2xl sm:text-3xl font-bold tracking-tight">
            Recent Activity
          </p>
        </div>

        <p className="text-gray-400 mt-2 text-sm sm:text-base">
          Real-time log of your workspace events and collaborations
        </p>
      </div>

      {/* Timeline */}
      <div className="px-4 sm:px-6 lg:px-10 mt-8">
        {activitiesData.map((data) => (
          <RecentCard key={data.id} data={data} />
        ))}
      </div>
    </div>
  );
};

export default RecentActivities;
