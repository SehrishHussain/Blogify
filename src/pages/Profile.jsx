import React from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { User, Mail, Shield, Calendar } from "lucide-react"; // icons for each field

function Profile() {
  const { userData } = useSelector((state) => state.auth);

  if (!userData) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#fffaf7] via-[#fbefe3] to-[#f4dfc8] dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 transition-colors duration-500">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl shadow-2xl rounded-3xl p-10 w-full max-w-md text-center border border-gray-200/60 dark:border-gray-700/60"
        >
          <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-gray-100">
            Not Logged In
          </h2>
          <p className="text-gray-700 dark:text-gray-400">
            Please log in to view your profile.
          </p>
        </motion.div>
      </div>
    );
  }

  const { name, email, role, $createdAt } = userData.user;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#fffaf7] via-[#fbefe3] to-[#f4dfc8] dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 transition-all duration-500 px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-2xl shadow-2xl rounded-[2.5rem] p-10 w-full max-w-lg text-center border border-gray-200/60 dark:border-gray-700/60"
      >
        {/* Profile Avatar */}
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-pink-500 to-rose-400 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
            {name.charAt(0).toUpperCase()}
          </div>
        </div>

        {/* Title */}
        <h2 className="text-3xl font-extrabold mb-2 text-gray-900 dark:text-white">
          {name}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Welcome back to your Blogify profile 
        </p>

        {/* Details */}
        <div className="space-y-5 text-left">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/50 dark:bg-gray-700/60 shadow-sm border border-gray-200/50 dark:border-gray-600/40">
            <User className="w-5 h-5 text-pink-600" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
              <p className="font-medium text-gray-800 dark:text-gray-100">
                {name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/50 dark:bg-gray-700/60 shadow-sm border border-gray-200/50 dark:border-gray-600/40">
            <Mail className="w-5 h-5 text-pink-600" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
              <p className="font-medium text-gray-800 dark:text-gray-100">
                {email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/50 dark:bg-gray-700/60 shadow-sm border border-gray-200/50 dark:border-gray-600/40">
            <Shield className="w-5 h-5 text-pink-600" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Role</p>
              <p className="font-medium capitalize text-gray-800 dark:text-gray-100">
                {role}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/50 dark:bg-gray-700/60 shadow-sm border border-gray-200/50 dark:border-gray-600/40">
            <Calendar className="w-5 h-5 text-pink-600" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Joined</p>
              <p className="font-medium text-gray-800 dark:text-gray-100">
                {new Date($createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Profile;
