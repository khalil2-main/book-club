import React, { useState } from 'react'
import Login from './login'
import Signup from './signup'

const loginsignup = () => {
    const [isSignUp, setIsSignUp] = React.useState(true)
  return (
    <div className='flex flex-col items-center'>
      <div className='flex-grow'>
        {isSignUp ? <Signup /> : <Login />}
      </div>
        <button onClick={() => setIsSignUp(!isSignUp)} className="absolute bottom-4 text-indigo-600 font-medium hover:underline transition">{isSignUp ? "Already have an account? Log in" : "Don't have an account? Sign up"}</button>
    </div>
  )
}

export default loginsignup