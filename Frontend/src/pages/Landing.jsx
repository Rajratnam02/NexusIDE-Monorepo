import React from 'react'
import Navbar from '../components/Navbar'
import { Shield, Terminal, Users, Zap } from 'lucide-react'
import FeatureCard from '../components/FeatureCard'
import { useNavigate } from 'react-router-dom'

const Landing = () => {
  const navigate = useNavigate();
  return (
    <div className='bg-[#0A0A0A] min-h-screen pb-10 text-white'>
      <Navbar />

    {/* Section 1 */}
      <section className='max-w-7xl mx-auto px-8 pt-16 pb-24 text-center flex flex-col items-center justify-center '>
        
        <div className='flex flex-col items-center  max-w-4xl justify-center'>
          <h1 className='text-5xl md:text-7xl font-extrabold mb-6 tracking-tight'>
            Code together,<br/><span className='text-blue-600'>anywhere in real-time.</span>
          </h1>
          <p className='text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed'>
            The collaborative IDE built for speed. Pair program, debug, and ship code with your team in a powerful, sandboxed environment.
          </p>
        </div>

        <div className=' gap-10 flex'>
          <p onClick={()=>{navigate('/join')}} className='w-full cursor-pointer sm:w-auto px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2'>
            <Users size={20} />
            Join a Room
          </p>
          <p onClick={()=>{navigate('/dashboard')}} className='w-full cursor-pointer sm:w-auto px-8 py-4 bg-[#1E2939] text-white font-bold rounded-xl hover:bg-[#28374d] transition-all flex items-center justify-center gap-2'>
            Create New Project
          </p>
        </div>

      </section>

    {/* Section 2 */}
      <section className='max-w-7xl mx-auto px-30'>
          <div className='flex flex-col  '>
            
            <div className='bg-[#252525] border border-gray-800 h-10 rounded-t-xl px-5 flex justify-between items-center'>
              <div className='flex items-center gap-2'>
                <div className='h-3 w-3 rounded-full bg-red-500/50'></div>
                <div className='h-3 w-3 rounded-full bg-yellow-500/50'></div>
                <div className='h-3 w-3 rounded-full bg-green-500/50'></div>
              </div>

              <p className='text-xs text-gray-500 font-mono italic'>NexusIDE - main.py</p>

              <div></div>
            </div>

            <div className='bg-[#1E1E1E] border border-gray-800 border-t-0 rounded-b-xl h-50'>
              <div className='flex flex-col px-10 py-5'>
                <p className='text-blue-500'>import <span className='text-white'>nexus</span></p>
                <p className='text-gray-400 mt-2'><span className='text-purple-400'>def </span><span className='text-yellow-300'>collaborate</span>(team):</p>
                <p className='text-gray-400 mx-5'><span className='text-purple-400'>return</span> team.sync_realtime()</p>
                <p className='mt-5 text-gray-400'>// User "Alex" joined the room...</p>
                <p className='text-gray-400'>// User "Sarah" is typing!!</p>
              </div>
            </div>

            <div>

            </div>
          </div>
      </section>

    {/* Section 3 */}
      <section className='grid grid-cols-1 md:grid-cols-3 gap-12 max-w-7xl mx-auto px-8 py-24 border-t border-gray-900'>
          <FeatureCard icon={<Zap className='text-yellow-500' />} 
                       title="Ultra-Low Latency" 
                       desc="Powered by Socket.IO for sub-50ms synchronization across all connected peers." />
          <FeatureCard icon={<Shield className='text-green-500' />}
                        title="Isolated Execution" 
                        desc="Run your C++, JS, and Python code securely inside Dockerized sandboxes." />
          <FeatureCard icon={<Terminal className='text-blue-500' />} 
                        title="Integrated Terminal" 
                        desc="Full output console support to see execution results and debug logs instantly." />
      </section>
    </div>
  )
}

export default Landing