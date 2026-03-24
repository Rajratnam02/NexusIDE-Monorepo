import React, { useEffect, useState } from 'react'

const SidebarButton = (props) => {
  const generalClass = "flex items-center gap-3 px-4 py-2.5 rounded-xl cursor-pointer transition-all"
  const activeClass = " text-blue-500 bg-blue-600/10 font-semibold"
  const disabledClass = "text-gray-400 hover:bg-[#151515] hover:text-gray-200"
  const [active,setActive] = useState(false)
  
  useEffect(()=>{
    setActive(props.selected === props.title)
  },[props.selected])

  const clickHandler = () => {
    props.setSelected(props.title)
  }

  return (
    <div onClick={clickHandler} className={generalClass + (active ? activeClass : disabledClass)}>
        {props.icon}
        <p className='text-sm'>{props.title}</p>
    </div>
  )
}

export default SidebarButton