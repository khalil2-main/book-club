import React from 'react'
import imager from "../assets/images/reader.png"

const SideImage = () => {
  return (
    <div className="relative w-full h-full bg-gradient-to-tr from-blue-200 via-blue-100 to-blue-50">
      <img 
        src={imager} 
        alt="Reader illustration" 
        className="w-auto h-500px object-contain"
      />
    </div>
  )
}

export default SideImage
