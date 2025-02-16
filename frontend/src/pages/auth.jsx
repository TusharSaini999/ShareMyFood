import { useState } from "react";
import { motion } from "framer-motion";
import "tailwindcss/tailwind.css";

const AuthComponent = () => {
  const [authState, setAuthState] = useState("signin");

  const toggleAuth = (state) => {
    setAuthState(state);
  };

  return (
    <div
      className={`relative min-h-screen flex items-center justify-center transition-all duration-700 px-4 sm:px-6 lg:px-8 ${
        authState === "signin" ? "bg-[#FF6B35]" : "bg-[#f4deca]"
      }`}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative w-full max-w-4xl p-10 bg-[#edd7c3] rounded-lg shadow-2xl overflow-hidden"
      >
        <motion.div
          initial={{ x: "100%", opacity: 0 }}
          animate={{ x: "0%", opacity: 1 }}
          exit={{ x: "-100%", opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          key={authState}
        >
          {authState === "signin" && (
            <div>
              <h2 className="text-4xl font-bold text-center text-[#FF6B35] mb-6">
                Welcome Back
              </h2>
              <div className="space-y-5">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">
                    Email
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-[#FF6B35] focus:border-[#FF6B35]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-[#FF6B35] focus:border-[#FF6B35]"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full py-3 bg-[#FF6B35] text-white rounded-lg hover:bg-orange-600 transition-all duration-300"
                >
                  Sign In
                </motion.button>
                <motion.p
                  whileHover={{ scale: 1.1 }}
                  className="text-center text-sm text-gray-600 cursor-pointer mt-3"
                  onClick={() => toggleAuth("forgot")}
                >
                  Forgot password?
                </motion.p>
                <motion.p
                  whileHover={{ scale: 1.1 }}
                  className="text-center text-sm text-gray-600 cursor-pointer mt-3"
                  onClick={() => toggleAuth("signup")}
                >
                  Don't have an account?{" "}
                  <span className="text-[#FF6B35] font-bold">Sign up here</span>
                </motion.p>
              </div>
            </div>
          )}

          {authState === "signup" && (
            <div>
              <h2 className="text-4xl font-bold text-center text-[#FF6B35] mb-6">
                Create Your Account
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-[#FF6B35] focus:border-[#FF6B35]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-[#FF6B35] focus:border-[#FF6B35]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-[#FF6B35] focus:border-[#FF6B35]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">
                    Role
                  </label>
                  <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-[#FF6B35] focus:border-[#FF6B35]">
                    <option>NGO</option>
                    <option>User</option>
                    <option>Farmer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-[#FF6B35] focus:border-[#FF6B35]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-[#FF6B35] focus:border-[#FF6B35]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-[#FF6B35] focus:border-[#FF6B35]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">
                    Profile Picture (Optional)
                  </label>
                  <input
                    type="file"
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                </div>
                <div className="col-span-2 flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-gray-700 text-sm">
                    I agree to the{" "}
                    <a href="#" className="text-[#FF6B35] font-bold">
                      Terms & Conditions
                    </a>
                  </span>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full py-3 bg-[#FF6B35] text-white rounded-lg hover:bg-orange-600 transition-all duration-300 mt-4"
              >
                Sign Up
              </motion.button>
              <motion.p
                whileHover={{ scale: 1.1 }}
                className="text-center text-sm text-gray-600 cursor-pointer mt-3"
                onClick={() => toggleAuth("signin")}
              >
                Already have an account?{" "}
                <span className="text-[#FF6B35] font-bold">Sign in here</span>
              </motion.p>
            </div>
          )}

          {authState === "forgot" && (
            <div>
              <h2 className="text-4xl font-bold text-center text-[#FF6B35] mb-6">
                Reset Your Password
              </h2>
              <div className="space-y-5">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">
                    Enter Your Email
                  </label>
                  <input
                    type="email"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-[#FF6B35] focus:border-[#FF6B35]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-[#FF6B35] focus:border-[#FF6B35]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">
                    Enter OTP
                  </label>
                  <input
                    type="number"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-[#FF6B35] focus:border-[#FF6B35]"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full py-3 bg-[#FF6B35] text-white rounded-lg hover:bg-orange-600 transition-all duration-300"
                >
                  Reset Password
                </motion.button>
                <motion.p
                  whileHover={{ scale: 1.1 }}
                  className="text-center text-sm text-gray-600 cursor-pointer mt-3"
                  onClick={() => toggleAuth("signin")}
                >
                  Back to{" "}
                  <span className="text-[#FF6B35] font-bold">Sign In</span>
                </motion.p>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AuthComponent;
