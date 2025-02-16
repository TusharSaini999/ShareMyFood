"use client"

import { motion } from "framer-motion"
import { Star } from "lucide-react"
import React from "react"

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Food Bank Coordinator",
    content: "This platform has transformed how we distribute food to those in need. The efficiency and support are outstanding!",
    rating: 5,
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    name: "David Chen",
    role: "Community Leader",
    content: "The impact on our local community has been incredible. The ability to connect donors with recipients seamlessly is a game-changer.",
    rating: 5,
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    name: "Emma Williams",
    role: "Nonprofit Director",
    content: "The tools and support provided have helped us scale our food donation efforts beyond what we thought possible.",
    rating: 5,
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    name: "Michael Lee",
    role: "Restaurant Owner",
    content: "A seamless way to donate surplus food and ensure it reaches those in need quickly. Truly a great initiative!",
    rating: 5,
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    name: "Sophia Patel",
    role: "Volunteer",
    content: "Volunteering has never been more rewarding. This platform makes food donation easy and impactful.",
    rating: 5,
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    name: "James Rodriguez",
    role: "NGO Partner",
    content: "We’ve been able to feed thousands more because of this initiative. The real-time tracking feature is a game-changer!",
    rating: 5,
    image: "/placeholder.svg?height=100&width=100",
  },
];


export function TestimonialsSection() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="mt-2 text-4xl font-bold text-gray-900">What Our Users Say</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-xl p-8"
            >
              <div className="flex items-center space-x-2 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-6">{testimonial.content}</p>
              <div className="flex items-center space-x-4">
                <img
                  src={testimonial.image || "/placeholder.svg"}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

