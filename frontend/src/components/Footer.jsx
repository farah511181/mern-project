import React from 'react'
import { FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa'

const Footer = () => {
  return (
    <footer className="bg-[#f8f8f8] text-gray-700 mt-20">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Logo / Brand */}
        <div>
          <h2 className="text-2xl font-bold text-[#F83002]">JobFinder</h2>
          <p className="mt-2 text-sm text-gray-500">Your career starts here.</p>
        </div>

        {/* Useful Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-[#F83002]">Home</a></li>
            <li><a href="#" className="hover:text-[#F83002]">Jobs</a></li>
            <li><a href="#" className="hover:text-[#F83002]">Categories</a></li>
            <li><a href="#" className="hover:text-[#F83002]">Contact</a></li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Follow Us</h3>
          <div className="flex space-x-4 text-xl">
            <a href="#"><FaFacebook className="hover:text-[#F83002]" /></a>
            <a href="#"><FaInstagram className="hover:text-[#F83002]" /></a>
            <a href="#"><FaLinkedin className="hover:text-[#F83002]" /></a>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 py-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} JobFinder. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer
