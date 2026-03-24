import { Code2 } from 'lucide-react'
import React from 'react'

const Login = () => {
  return (
    <div className='min-h-screen  bg-[#0A0A0A] flex items-center justify-center'>
        <div className='bg-[#111111] border-gray-800 border w-full  max-w-md rounded-2xl  p-8 md:p-10 shadow-2xl'>
            <div className="flex flex-col items-center text-center">
            <div className='flex items-center gap-3 justify-center  '>
              <div className="p-3 bg-blue-600 hover:rotate-12 transition-transform duration-300 w-fit  rounded-2xl">
                <Code2 className='text-white w-6 h-6' />
              </div>
              <p className='text-white text-xl tracking-tight font-bold'>Nexus<span className='text-blue-600'>IDE</span></p>
            </div>
          <h1 className="text-3xl mt-5 font-bold text-white tracking-tight">Sign in</h1>
          <p className="text-gray-400 mt-2 text-sm">Sign in to continue to your workspace</p>
        </div>

        </div>


    </div>
  )
}

export default Login