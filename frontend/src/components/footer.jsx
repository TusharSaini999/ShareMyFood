"use client";

import { motion } from "framer-motion";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import React from "react";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <h3 className="text-2xl font-bold text-[#FF6B35]">ShareMyFood</h3>
            <p className="text-gray-400">
            Together, We Can End Hunger for Good.
            </p>
            <div className="flex space-x-4">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, index) => (
                <motion.a
                  key={index}
                  href="#"
                  whileHover={{ scale: 1.2 }}
                  className="text-gray-400 hover:text-[#FF6B35] transition-colors"
                >
                  <Icon size={20} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {[
            { section: "About", links: ["Our Mission", "How It Works", "Impact", "Careers"] },
            { section: "Get Involved", links: ["Donate Food", "Volunteer", "Partner With Us", "Success Stories"] },
            { section: "Resources", links: ["FAQs", "Food Safety", "Reports & Insights", "Contact Us"] },
          ].map(({ section, links }, index) => (
            <motion.div
              key={section}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="space-y-4"
            >
              <h4 className="text-lg font-semibold">{section}</h4>
              <ul className="space-y-2">
                {links.map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-400 hover:text-[#FF6B35] transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400"
        >
          <p>&copy; {new Date().getFullYear()} ShareMyFood. All rights reserved.</p>
        </motion.div>
      </div>
    </footer>
  );
}
