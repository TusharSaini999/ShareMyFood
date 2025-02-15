"use client"

import { motion } from "framer-motion"
import React from "react"

export function CTASection() {
  return (
    <section className="py-24 bg-gradient-to-br from-[#FF6B35] to-[#4ECDC4] relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-white/10 bg-grid-8" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Make a Difference?</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of others who are already making an impact. Start your journey today and be the reason
            someone smiles!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-white text-[#FF6B35] rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors"
            >
              Get Started Now
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-full font-semibold text-lg hover:bg-white/10 transition-colors"
            >
              Know More
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

