import React from 'react'
import{ assets } from '../assets/assets'
import { useNavigate} from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="relative overflow-hidden px-6 md:px-16 lg:px-24 xl:px-32 w-full text-sm text-slate-500 bg-white pt-10">
      
      {/* Background SVG */}
      <svg
        className="hidden md:block absolute -bottom-30 -left-80 opacity-5 w-full h-full pointer-events-none"
        width="68"
        height="26"
        viewBox="0 0 68 26"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0)">
          <path
            d="M16.141 0C13.4854 0 10.9387 1.04871 9.06091 2.91543L2.93268 9.00761C1.05492 10.8743 0 13.4061 0 16.0461C0 21.5435 4.48289 26 10.0128 26..."
            fill="#364153"
          />
        </g>
        <defs>
          <clipPath id="clip0">
            <rect width="68" height="26" fill="white" />
          </clipPath>
        </defs>
      </svg>

      {/* Main Content */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-14">
        
        {/* Brand */}
        <div className="sm:col-span-2 lg:col-span-1">
          <a href="/">
          <img src={assets.logo} alt="logo " className='w-32 sm:w-44 cursor-pointer' onClick={() => navigate('/')}/>
          </a>
          <p className="text-sm leading-7 mt-6">
            A modern AI-powered platform to create, enhance, and optimize your content using smart tools.
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-col lg:items-center lg:justify-center">
          <div className="flex flex-col text-sm space-y-2.5">
            <h2 className="font-semibold mb-5 text-gray-800">Company</h2>
            <a className="hover:text-slate-600 transition" href="#">About us</a>
            <a className="hover:text-slate-600 transition" href="#">Careers</a>
            <a className="hover:text-slate-600 transition" href="#">Contact us</a>
            <a className="hover:text-slate-600 transition" href="#">Privacy policy</a>
          </div>
        </div>

        {/* Newsletter */}
        <div>
          <h2 className="font-semibold text-gray-800 mb-5">
            Subscribe to our newsletter
          </h2>
          <div className="text-sm space-y-6 max-w-sm">
            <p>The latest news, articles, and resources, sent weekly.</p>
            <div className="flex items-center">
              <input
                className="rounded-l-md bg-gray-100 outline-none w-full max-w-64 h-11 px-3"
                type="email"
                placeholder="Enter your email"
              />
              <button className="bg-blue-500 from-indigo-600 to-indigo-800 hover:from-indigo-700 hover:to-indigo-900 transition px-4 h-11 text-white rounded-r-md cursor-pointer">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-4 border-t mt-6 border-slate-200">
        
        </div>
        <p className='pt-4 text-center md:text-sm pb-5'>
            
            Copyright 2026 @QuickAI. All rights reserved.
        </p>
        
      
    </footer>
  )
}

export default Footer
