import React from 'react';
import { motion } from 'framer-motion';
import ourPlatform from '../images/our-platform.png';
import userCentric from '../images/user-centric.png';
import aiFarmingAssistance from '../images/ai-farming-assistance.png';
import impactBadge from '../images/impact-badge.png';

const AboutPage = () => {
  return (
    <div className="min-h-screen py-10 bg-gradient-to-b from-teal-800 to-teal-700">
      {/* Header */}
      <div className="bg-teal-800 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="container mx-auto px-4"
        >
          <h1 className="text-3xl font-light text-white mb-2">The Zero Hunger Mission</h1>
          <p className="text-teal-100">We know hunger is solvable. In fact, we're building the platform for it.</p>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="bg-slate-50 min-h-screen py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Mission Statement */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <p className="text-slate-600 leading-relaxed text-lg">
              At Zero Hunger, we believe there is a better way to fight hunger. A more impactful way
              where communities are connected rather than divided. We're passionately focused on this,
              and our mission is to help eliminate hunger through technology. We focus on creating
              seamless connections between those who can help and those who need it.
            </p>
          </motion.div>

          {/* Our Platform Section */}
          <div className="grid md:grid-cols-2 gap-16 mb-20">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              <h2 className="text-2xl font-semibold text-slate-800">Our Platform</h2>
              <p className="text-slate-600">
                Our platform connects NGOs, donors, and those in need through an intuitive dashboard
                system. NGOs can manage donations, coordinate with volunteers, and efficiently distribute
                resources to those who need them most.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <img 
                src={ourPlatform} 
                alt="Platform dashboard" 
                className="rounded-lg shadow-xl"
              />
            </motion.div>
          </div>

          {/* Early Growth Section */}
          <div className="grid md:grid-cols-2 gap-16 mb-20">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="order-2 md:order-1"
            >
              <img 
                src={userCentric} 
                alt="Team collaboration" 
                className="rounded-lg shadow-xl"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 }}
              className="space-y-4 order-1 md:order-2"
            >
              <h2 className="text-2xl font-semibold text-slate-800">User-Centric Features</h2>
              <p className="text-slate-600">
                Our platform empowers users to make direct food donations, track their contributions,
                and connect with local NGOs. We've implemented smart features like automated request
                redistribution and social media integration to maximize impact.
              </p>
            </motion.div>
          </div>

          {/* Innovation Section */}
          <div className="grid md:grid-cols-2 gap-16 mb-20">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.1 }}
              className="space-y-4"
            >
              <h2 className="text-2xl font-semibold text-slate-800">Farmer Support</h2>
              <p className="text-slate-600">
                We're revolutionizing agricultural support with AI-powered soil prediction, an
                intelligent chatbot for farming queries, and comprehensive video tutorials. Our
                rewards system encourages sustainable farming practices.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3 }}
            >
              <img 
                src={aiFarmingAssistance} 
                alt="AI farming assistance" 
                className="rounded-lg shadow-xl"
              />
            </motion.div>
          </div>

          {/* Global Impact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
            className="text-center space-y-4"
          >
            <h2 className="text-2xl font-semibold text-slate-800">A Global Movement</h2>
            <p className="text-slate-600">
              With our Help Page tracking ongoing activities and our global chatbot providing
              24/7 support, we're building more than a platform - we're creating a worldwide
              community dedicated to eliminating hunger.
            </p>
            <div className="pt-8">
              <motion.img 
                src={impactBadge}
                alt="Impact badge" 
                className="mx-auto w-24 h-24"
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;