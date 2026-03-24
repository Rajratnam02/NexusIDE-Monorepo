import { Menu, Search } from 'lucide-react'
import React from 'react'

const DashboardNavbar = () => {
  
  return (
    <div className='border-b  border-gray-800 w-full h-15 flex items-center justify-between'>
        {/* <Menu onClick={menuHandler} className='ml-5 bg-blue-600 rounded-full' /> */}

        <div className='flex items-center border pl-3 py-2 border-gray-800 rounded-lg bg-[#111111] ml-10 gap-4'>
            <Search className='text-gray-500' size={16} />
            <input
                type='text'
                placeholder="Search projects..."
                className='w-full bg-[#111111] pr-30 text-sm focus:border-blue-500/50 outline-none transition-all'
            />
        </div>

        <div className='h-8 mr-10 flex items-center justify-center font-bold border-blue-800 rounded-full aspect-square bg-blue-600 border'>
            R
        </div>

    </div>
  )
}

export default DashboardNavbar