import React from 'react'
import Image from 'next/image'

const Login = () => {
  return (
    <div className="bg-gray-50 flex items-center justify-center min-h-screen px-4">
    <div className="bg-white shadow-xl justify-center rounded-2xl p-6 sm:p-10 max-w-sm w-full flex flex-col gap-6">
      <Image
            src="/OwlReadsLogo.png"
            alt="OwlReads Logo"
            width={500}
            height={500}
            className="mr-3"
          />
      <h2 className="text-3xl font-semibold text-center text-gray-900">
        Log Back in!
      </h2>
  
      <form>
         <button className="btnprimary">Login</button>
      </form>
    </div>
  </div>
  )
}

export default Login