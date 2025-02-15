"use client"

import { motion } from "framer-motion"
import React from "react"
import heroImage from "../images/hero-image.png";

export function HeroSection() {
  return (
    <div className="bg-white pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight text-gray-900 mb-6">
              Be The Reason
              <br />
              <span className="text-[#FF6B35]">Someone Smiles Today!</span>
            </h1>
            <p className="text-gray-600 mb-8 text-lg">
              Join us in the fight against hunger and make a lasting impact—because every meal matters 😊
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#FF6B35] text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-[#ff825f] transition-colors"
            >
              Get Started
            </motion.button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <img
              src={heroImage}
              alt="Hero Illustration"
              className="w-full h-auto"
            />
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
              className="absolute top-0 right-0"
            >
              <div className="w-16 h-16 text-[#FF6B35] opacity-50">❤️</div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

