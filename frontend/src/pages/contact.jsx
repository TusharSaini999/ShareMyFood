import React from 'react';
import { motion } from 'framer-motion';

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-5xl bg-slate-800 rounded-none overflow-hidden relative"
      >
        {/* Diagonal Divider */}
        <div 
          className="absolute top-0 right-0 w-2/3 h-full bg-slate-900 transform"
          style={{
            clipPath: 'polygon(100% 0, 100% 100%, 0 100%, 20% 0)'
          }}
        />

        <div className="flex flex-col md:flex-row relative">
          {/* Left Section */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="p-12 md:w-1/2 z-10"
          >
            <div className="mb-12">
              <span className="text-xl font-medium text-white">ShareMyFood</span>
            </div>
            
            <div className="mb-8">
              <span className="text-sm uppercase tracking-wider text-slate-400">Contact us</span>
              <h2 className="text-3xl font-bold text-white mt-2">
                We are here to help you <br /> with any question <br /> you may have.
              </h2>
            </div>
            
            <div className="text-slate-400 space-y-2 text-sm">
              <p>mailtosharemyfood@gmail.com</p>
              <p>+91 80775 22130</p>
              
              <div className="flex space-x-4 pt-4">
                <motion.a 
                  whileHover={{ scale: 1.1 }}
                  className="text-slate-400 hover:text-white"
                  href="#"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </motion.a>
                <motion.a 
                  whileHover={{ scale: 1.1 }}
                  className="text-slate-400 hover:text-white"
                  href="#"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </motion.a>
                <motion.a 
                  whileHover={{ scale: 1.1 }}
                  className="text-slate-400 hover:text-white"
                  href="#"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </motion.a>
              </div>

              <div className="pt-12 text-xs space-y-1">
                <h3 className="text-sm font-medium text-slate-400 mb-3">Address</h3>
                <p>Uttar Pradesh</p>
                <p>India</p>
              </div>
            </div>
          </motion.div>

          {/* Right Section */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="p-12 md:w-1/2 relative z-10"
          >
            <h3 className="text-sm uppercase tracking-wider text-slate-400 mb-8">Contact Form</h3>
            <form className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.6 }}
              >
                <input
                  type="text"
                  placeholder="Name"
                  className="w-full px-0 py-3 bg-transparent border-b border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-slate-400 text-sm"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, duration: 0.6 }}
              >
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full px-0 py-3 bg-transparent border-b border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-slate-400 text-sm"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3, duration: 0.6 }}
              >
                <textarea
                  placeholder="What can we help you with?"
                  rows="4"
                  className="w-full px-0 py-3 bg-transparent border-b border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-slate-400 text-sm resize-none"
                ></textarea>
              </motion.div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-2 bg-transparent text-white text-sm border border-slate-700 rounded-none hover:bg-slate-800 transition-colors"
              >
                Send message
              </motion.button>
            </form>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default ContactPage;