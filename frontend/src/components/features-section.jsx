"use client"

import { motion } from "framer-motion"
import { Users, Award, HeartHandshake, Globe, Clock, Shield } from "lucide-react"
import { Card3D } from "./ui/3d-card"
import React from "react"

const features = [
  {
    title: "Global Impact",
    description: "Bridging surplus food to those in need across 150+ countries with trusted local networks.",
    icon: Users,
    stats: "10M+ Meals Donated",
  },
  {
    title: "Trusted & Verified",
    description: "Ensuring transparency with verified partners and real-time donation tracking.",
    icon: Award,
    stats: "4.9/5 Donor Rating",
  },
  {
    title: "24/7 Support",
    description: "Dedicated assistance to help donors and recipients anytime, anywhere.",
    icon: HeartHandshake,
    stats: "Round-the-Clock Help",
  },
  {
    title: "Global Partnerships",
    description: "Collaborating with NGOs, businesses, and communities to fight hunger worldwide.",
    icon: Globe,
    stats: "150+ Partner Organizations",
  },
  {
    title: "Rapid Redistribution",
    description: "Fast food collection and delivery with real-time tracking for minimal waste.",
    icon: Clock,
    stats: "< 2hr Delivery",
  },
  {
    title: "Secure & Reliable",
    description: "End-to-end encryption and compliance with food safety and donation standards.",
    icon: Shield,
    stats: "100% Safe Donations",
  },
];


export function FeaturesSection() {
  return (
    <div className="bg-gradient-to-b from-gray-50 to-white py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-[#FF6B35] font-semibold text-sm tracking-wider uppercase">Why Choose Us</span>
          <h2 className="mt-2 text-4xl font-bold text-gray-900">Delivering Love</h2>
          <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
            Committed to a Hunger-Free Future – Efficient, Reliable, and Impact-Driven Food Redistribution.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card3D className="min-h-[320px] p-6" children={undefined}>
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-[#4ECDC4] opacity-20 rounded-full blur-xl" />
                    <div className="relative w-16 h-16 bg-gradient-to-br from-[#FF6B35] to-[#4ECDC4] rounded-full flex items-center justify-center">
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                  <div className="mt-4 px-4 py-2 bg-gray-50 rounded-full">
                    <span className="text-[#FF6B35] font-semibold">{feature.stats}</span>
                  </div>
                </div>
              </Card3D>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

