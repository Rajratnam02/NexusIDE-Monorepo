
import React, { useState } from 'react'
import Sidebar from '../components/Sidebar'
import DashboardNavbar from '../components/DashboardNavbar'
import Projects from '../components/Projects';
import SharedWithMe from '../components/SharedWithMe';
import RecentActivities from '../components/RecentActivities';

const Dashboard = () => {
  const [selected, setSelected] = useState("Projects");
  const [closed, setClosed] = useState(false)
  return (
    <div className='bg-[#0A0A0A] text-white min-h-screen flex'>
        <Sidebar closed={closed} setClosed={setClosed} selected = {selected} setSelected = {setSelected} />

        <div className={`flex transition-all duration-500 flex-1 flex-col ${(closed? " " : " ml-70 ")} `}>
          <DashboardNavbar closed={closed} setClosed={setClosed} />
          {selected === "Projects" && <Projects />}
          {selected === "Shared with me" && <SharedWithMe />}
          {selected === "Recent" && <RecentActivities />}
        </div>

    </div>
  )
}

export default Dashboard
