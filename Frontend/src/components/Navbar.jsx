import { Code2 } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
  const navigate = useNavigate();
  return (
    <div className='flex items-center justify-between px-8 py-6 max-w-7xl mx-auto'>
      
      <div className='flex items-center gap-2 group cursor-pointer'>
        <div className='bg-blue-600 p-1.5 rounded-lg group-hover:rotate-12 transition-transform'>
          <Code2 size={24} className="text-white" />
        </div>
        <p className='text-xl tracking-tight font-bold'>Nexus<span className='text-blue-600'>IDE</span></p>
      </div>

      <div className='flex gap-8 text-sm items-center'>
        <p onClick={()=>{navigate('/login')}} className='cursor-pointer font-medium hover:text-blue-500 '>Log in</p>
        <p onClick={()=>{navigate('/register')}} className='bg-blue-600 py-2 px-5 font-medium rounded-full cursor-pointer hover:bg-blue-500/90'>Get Started</p>
      </div>

    </div>
  )
}

export default Navbar