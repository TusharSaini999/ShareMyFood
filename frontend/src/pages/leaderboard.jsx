"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Star,
  Medal,
  Trophy,
  Phone,
  Mail,
  MapPin,
  Gift,
  HandHeart,
  Users,
  Activity,
  ChevronUp,
  Search,
  LayoutGrid,
  LayoutList,
} from "lucide-react"

const NGOCard = React.memo(({ ngo, index, isCompact }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const badgeIcon = index < 3 ? [Trophy, Medal, Star][index] : null

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg shadow-md overflow-hidden mb-4 transition-all duration-300 hover:shadow-lg border border-gray-100"
    >
      <div
        className={`p-4 cursor-pointer ${isCompact ? "sm:p-3" : "sm:p-6"}`}
        onClick={() => !isCompact && setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img
                src={ngo.logo || "/placeholder.svg"}
                alt={`${ngo.name} logo`}
                className={`rounded-full object-cover ${isCompact ? "w-10 h-10" : "w-16 h-16"}`}
              />
              {badgeIcon && (
                <motion.div
                  className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-1"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 500, damping: 15 }}
                >
                  {React.createElement(badgeIcon, { size: isCompact ? 12 : 16, className: "text-white" })}
                </motion.div>
              )}
            </div>
            <div>
              <h2 className={`font-bold text-gray-800 ${isCompact ? "text-sm" : "text-lg"}`}>{ngo.name}</h2>
              <p className={`text-gray-600 ${isCompact ? "text-xs" : "text-sm"}`}>Rank: #{ngo.rank}</p>
            </div>
          </div>
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={isCompact ? 12 : 16}
                className={i < Math.floor(ngo.rating) ? "text-yellow-400" : "text-gray-300"}
              />
            ))}
            <span className={`ml-1 text-gray-600 ${isCompact ? "text-xs" : "text-sm"}`}>({ngo.rating.toFixed(1)})</span>
          </div>
        </div>
        {!isCompact && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm mt-4">
            <div className="flex items-center space-x-2 bg-blue-50 p-2 rounded-lg">
              <Gift className="text-blue-500" size={16} />
              <p className="text-gray-700">Received: {ngo.donationsReceived}</p>
            </div>
            <div className="flex items-center space-x-2 bg-green-50 p-2 rounded-lg">
              <HandHeart className="text-green-500" size={16} />
              <p className="text-gray-700">Distributed: {ngo.donationsDistributed}</p>
            </div>
            <div className="flex items-center space-x-2 bg-orange-50 p-2 rounded-lg">
              <Activity className="text-orange-500" size={16} />
              <p className="text-gray-700">Ongoing: {ngo.ongoingRequests}</p>
            </div>
            <div className="flex items-center space-x-2 bg-purple-50 p-2 rounded-lg">
              <Users className="text-purple-500" size={16} />
              <p className="text-gray-700">Volunteers: {ngo.volunteerRequests}</p>
            </div>
          </div>
        )}
      </div>
      <AnimatePresence>
        {isExpanded && !isCompact && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="px-6 pb-4"
          >
            <div className="border-t pt-4">
              <div className="grid sm:grid-cols-2 gap-2 mb-4 text-sm">
                <div className="flex items-center space-x-2 bg-gray-50 p-2 rounded-lg">
                  <Mail className="text-gray-400" size={14} />
                  <p className="text-gray-600">{ngo.email}</p>
                </div>
                <div className="flex items-center space-x-2 bg-gray-50 p-2 rounded-lg">
                  <Phone className="text-gray-400" size={14} />
                  <p className="text-gray-600">{ngo.phone}</p>
                </div>
                <div className="flex items-center space-x-2 sm:col-span-2 bg-gray-50 p-2 rounded-lg">
                  <MapPin className="text-gray-400" size={14} />
                  <p className="text-gray-600">{ngo.location}</p>
                </div>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2 text-sm">Recent Activities</h3>
              <ul className="space-y-2">
                {ngo.recentActivities.map((activity, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-start">
                    <span className="mr-2">•</span>
                    {activity}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
})

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false)

  React.useEffect(() => {
    const toggleVisibility = () => setIsVisible(window.pageYOffset > 300)
    window.addEventListener("scroll", toggleVisibility)
    return () => window.removeEventListener("scroll", toggleVisibility)
  }, [])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-4 right-4 bg-blue-500 text-white p-2 rounded-full shadow-lg hover:bg-blue-600 transition-colors duration-300"
          aria-label="Scroll to top"
        >
          <ChevronUp size={24} />
        </motion.button>
      )}
    </AnimatePresence>
  )
}

const NGOLeaderboard = () => {
  const [ngos, setNgos] = useState([
    {
      id: 1,
      name: "Feeding Hope",
      logo: "/placeholder.svg?height=64&width=64",
      email: "contact@feedinghope.org",
      phone: "+1 (555) 123-4567",
      location: "New York, NY",
      donationsReceived: 15000,
      donationsDistributed: 14500,
      ongoingRequests: 25,
      volunteerRequests: 10,
      rank: 1,
      rating: 4.9,
      recentActivities: [
        "Distributed 1000 meals in downtown area",
        "Launched new volunteer program",
        "Received large donation from local business",
      ],
    },
    {
      id: 2,
      name: "Helping Hands",
      logo: "/placeholder.svg?height=64&width=64",
      email: "contact@helpinghands.org",
      phone: "+1 (555) 987-6543",
      location: "Los Angeles, CA",
      donationsReceived: 12000,
      donationsDistributed: 11000,
      ongoingRequests: 15,
      volunteerRequests: 8,
      rank: 2,
      rating: 4.7,
      recentActivities: [
        "Provided medical supplies to disaster victims",
        "Organized a community cleanup event",
        "Partnered with local schools for educational programs",
      ],
    },
    {
      id: 3,
      name: "Community Support",
      logo: "/placeholder.svg?height=64&width=64",
      email: "contact@communitysupport.org",
      phone: "+1 (555) 555-5555",
      location: "Chicago, IL",
      donationsReceived: 10000,
      donationsDistributed: 9500,
      ongoingRequests: 20,
      volunteerRequests: 12,
      rank: 3,
      rating: 4.5,
      recentActivities: [
        "Built a new community garden",
        "Hosted a fundraising event",
        "Provided job training to unemployed individuals",
      ],
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [isCompact, setIsCompact] = useState(false)

  const filteredNGOs = ngos
    .filter((ngo) => ngo.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => a.rank - b.rank)

  return (
    <div className="max-w-4xl mx-auto px-4 py-24">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">NGO Leaderboard</h1>
      <p className="text-center text-gray-600 mb-8">Honoring Top NGOs Creating Lasting Impact</p>
      
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <input
              type="text"
              placeholder="Search NGOs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>
          <button
            onClick={() => setIsCompact(!isCompact)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-300 border border-gray-200"
          >
            {isCompact ? <LayoutList size={18} /> : <LayoutGrid size={18} />}
            <span>{isCompact ? "Detailed View" : "Compact View"}</span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {filteredNGOs.map((ngo, index) => (
          <NGOCard key={ngo.id} ngo={ngo} index={index} isCompact={isCompact} />
        ))}
      </AnimatePresence>
      <ScrollToTopButton />
    </div>
  )
}

export default NGOLeaderboard