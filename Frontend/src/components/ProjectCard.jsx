import { Code2 } from 'lucide-react'
import React from 'react'

const ProjectCard = ({data}) => {
  return (
    <div className='group bg-[#111111] border  border-gray-800 rounded-2xl p-6 hover:border-blue-500/50 hover:bg-[#141414] transition-all cursor-pointer'>
        <div className=' flex flex-col'>
            <div className="w-12 h-12 bg-gray-900 border border-gray-800 rounded-xl flex items-center justify-center text-blue-500 mb-4 group-hover:scale-110 transition-transform">
                <Code2 size={24} />
            </div>

            <p className='text-lg font-bold text-gray-100 group-hover:text-blue-400 transition-colors truncate'>
                {data.name}
            </p>

            <div className='flex items-center gap-2 mt-1'>
              <p className="text-[10px] px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-md font-bold uppercase tracking-widest">{data.lang}</p>
              <p className="text-[10px] text-gray-600 font-medium tracking-tight">{data.files} Files</p>
            </div>

            <div className='border-t border-gray-800 flex justify-between items-center mt-10'>
                <div className='flex -space-x-2 pt-3'>
                   
                    {data.collaborators.map((initials, index) => (
                      <div key={index} className='h-7 aspect-square rounded-full bg-gray-800 border-2 border-[#111111] flex items-center justify-center text-[10px] font-bold text-gray-400 uppercase'>
                        {initials}
                      </div>
                    ))}
                    {data.collaborators.length > 3 && (
                      <div className='h-7 aspect-square rounded-full bg-blue-600 border-2 border-[#111111] flex items-center justify-center text-[10px] font-bold text-white'>
                        +{data.collaborators.length - 3}
                      </div>
                    )}
                

                </div>

                <div className='pt-3'>
                  <p className="text-[10px] text-gray-600 uppercase font-bold">Last Edit</p>
                  <p className="text-xs text-gray-400 font-medium">{data.lastEdit}</p>
                </div>
            </div>

        </div>
    </div>
  )
}

export default ProjectCard