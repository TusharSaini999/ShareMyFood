import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Camera, Save, X, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NGOSettings = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [ngoProfile, setNgoProfile] = useState({
    name: "Raymond Ellis",
    email: "raymond@foodcharity.org",
    phone: "(555) 123-4567",
    address: "123 Charity Lane, Helpville",
    profileImage: "/api/placeholder/100/100",
    position: "Food Distribution Manager"
  });

  const [isEditing, setIsEditing] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  useEffect(() => {
    // Simulate loading profile data
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNgoProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Here you would typically send the updated profile to your backend
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      setNotification({
        show: true,
        message: 'Profile updated successfully!',
        type: 'success'
      });
      setIsEditing(false);

      // Hide notification after 3 seconds
      setTimeout(() => {
        setNotification(prev => ({ ...prev, show: false }));
      }, 3000);
    } catch (error) {
      setNotification({
        show: true,
        message: 'Failed to update profile',
        type: 'error'
      });
    }
  };

  const handleCancel = () => {
    // Reset the form and exit editing mode
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-t-4 border-b-4 border-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          className="mb-6 flex items-center"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <button 
            onClick={() => navigate('/ngo/dashboard')}
            className="flex items-center text-gray-600 hover:text-indigo-600 transition-colors"
          >
            <ChevronLeft className="h-5 w-5 mr-1" />
            Back to Dashboard
          </button>
        </motion.div>

        <motion.h1 
          className="text-3xl font-bold mb-8 text-indigo-800"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          NGO Settings
        </motion.h1>

        <motion.div 
          className="bg-white rounded-lg shadow-lg p-6"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <form onSubmit={handleSubmit}>
            <div className="mb-6 flex items-center">
              <motion.img 
                src={ngoProfile.profileImage} 
                alt="Profile" 
                className="w-24 h-24 rounded-full mr-4 object-cover"
                whileHover={{ scale: 1.1 }}
              />
              <motion.button
                type="button"
                className="bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700 transition-colors flex items-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Camera className="mr-2" size={18} />
                Change Photo
              </motion.button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div 
                className="form-group"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                  <User className="inline mr-2" size={18} />
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={ngoProfile.name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </motion.div>

              <motion.div 
                className="form-group"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                  <Mail className="inline mr-2" size={18} />
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={ngoProfile.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </motion.div>

              <motion.div 
                className="form-group"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
                  <Phone className="inline mr-2" size={18} />
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={ngoProfile.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </motion.div>

              <motion.div 
                className="form-group"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address">
                  <MapPin className="inline mr-2" size={18} />
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={ngoProfile.address}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </motion.div>
            </div>

            <motion.div 
              className="mt-8 flex justify-end"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              {!isEditing ? (
                <motion.button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Edit Profile
                </motion.button>
              ) : (
                <>
                  <motion.button
                    type="button"
                    onClick={handleCancel}
                    className="bg-gray-300 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors mr-4 flex items-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <X className="mr-2" size={18} />
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Save className="mr-2" size={18} />
                    Save Changes
                  </motion.button>
                </>
              )}
            </motion.div>
          </form>
        </motion.div>

        {/* Notification Toast */}
        {notification.show && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={`fixed bottom-4 right-4 px-4 py-3 rounded-lg shadow-lg text-white ${
              notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
            }`}
          >
            {notification.message}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default NGOSettings;