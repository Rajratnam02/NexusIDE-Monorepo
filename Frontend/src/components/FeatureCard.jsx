import React from 'react'

const FeatureCard = ({ icon, title, desc }) => {
  return (
    <div className='text-left group'>
      <div className='mb-4 bg-gray-900 w-12 h-12 flex items-center justify-center rounded-xl border border-gray-800 group-hover:border-blue-500/50 transition-colors'>
        {icon}
      </div>
      <p className='text-lg font-bold mb-2'>{title}</p>
      <p className='text-gray-400 leading-relaxed'>{desc}</p>
    </div>
  )
}

export default FeatureCard