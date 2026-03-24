import { Clock, Code2, Folder, LogOut, MoveLeft, Settings, SquareArrowRightExit, User } from 'lucide-react'
import React from 'react'
import SidebarButton from './SidebarButton'
import { useNavigate } from 'react-router-dom'

const Sidebar = ({selected, setSelected}) => {
  const navigate = useNavigate();
  
  const generalClass = "border-gray-800 border-r w-70 fixed h-screen transition-all duration-500 justify-between flex flex-col"
  const openClass = ""
  const closedClass = "-translate-x-full"
  

  return (
    <div className={generalClass + " " + (closed ? closedClass : openClass)}>
        
        <div className='flex mx-5  flex-col'> 
          {/* <div onClick={closeHandler} className='mt-10 flex items-center justify-end mr-5'>
            <MoveLeft />
          </div> */}
          
          {/* LOGO */}
          <div onClick={()=>{navigate("/")}} className='flex gap-2 items-center cursor-pointer mt-10'>
            <div className='bg-blue-600 p-1.5 rounded-lg hover:rotate-12 transition-transform w-fit'>
              <Code2 size={24} />
            </div>
            <p className='text-xl tracking-tight font-bold'>Nexus<span className='text-blue-600'>IDE</span></p>
          </div>
          {/* Buttons */}
          <div className='mt-10 flex flex-col gap-2.5 '>
            <SidebarButton icon={<Folder />} title={"Projects"} selected = {selected} setSelected = {setSelected} />
            <SidebarButton icon={<User />} title={"Shared with me"} selected = {selected} setSelected = {setSelected} />
            <SidebarButton icon={<Clock />} title={"Recent"} selected = {selected} setSelected = {setSelected} />
            <SidebarButton icon={<Settings />} title={"Settings"} selected = {selected} setSelected = {setSelected} />
          </div>
        </div>

        <div className='flex items-center px-10 cursor-pointer border-t border-gray-800  gap-3 text-gray-400 hover:text-red-400 transition-colors w-full py-4 text-sm'>
          <LogOut size={18} />
          <p className=''>Logout</p>
        </div>

    </div>
  )
}

export default Sidebar