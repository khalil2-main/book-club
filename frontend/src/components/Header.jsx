import React from 'react'
import logo from '../assets/images/logo.png';
const headerStyle = {display: 'flex',
                     alginItems: 'centre',
                     padding: '5px 10px',
                     backgroundColor: '#7d9afaff',
                     boxShadow: '0 2px 5px rgba (0,0,0,0.1)',
                     margin : '0px' }
const header = () => {
  return (
    <div className='flex items-center bg-blue-200 shadow-2xl m-0'>
        <img src={logo} alt="" style={{height : "70px", width : 'auto'}} />
        <h1 className='text-3xl text-white font-semibold'>BookClub</h1>
    </div>
  )
}

export default header