"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { NavLink } from "react-router-dom"
import { Menu, X } from "lucide-react"
import { Link, useNavigate, useLocation } from "react-router-dom";

export function NavBar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <motion.nav initial={{ y: -100 }} animate={{ y: 0 }} className="fixed top-0 left-0 right-0 bg-white z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <motion.div whileHover={{ scale: 1.05 }} className="flex-shrink-0 flex items-center">
            <NavLink to="/" className="text-[#FF6B35] text-2xl font-bold">
              ShareMyFood
            </NavLink>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {["Home", "Activities", "NGO Leaderboard", "AI", "About", "Contact"].map((item) => (
              <motion.div key={item} whileHover={{ scale: 1.1 }} className="relative group">
                <NavLink to={`/${item.toLowerCase()}`} className="text-gray-600 hover:text-[#FF6B35] transition-colors">
                  {item}
                </NavLink>
                <motion.div className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FF6B35] group-hover:w-full transition-all duration-300" />
              </motion.div>
            ))}
            
            <Link to="/auth">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-[#FF6B35] text-white px-6 py-2 rounded-full hover:bg-[#ff825f] transition-colors"
              >
                Login
              </motion.button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 hover:text-[#FF6B35] transition-colors">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg">
            {["Home", "Activities", "NGO Leaderboard", "AI", "About", "Contact"].map((item) => (
              <NavLink
                key={item}
                to={`/${item.toLowerCase()}`}
                className="block px-3 py-2 text-gray-600 hover:text-[#FF6B35] transition-colors"
              >
                {item}
              </NavLink>
            ))}
            <Link to="/auth">
              <button className="w-full text-center bg-[#FF6B35] text-white px-6 py-2 rounded-full hover:bg-[#ff825f] transition-colors">
              Login
              </button> 
            </Link>
          </div>
        </motion.div>
      )}
    </motion.nav>
  )
}

