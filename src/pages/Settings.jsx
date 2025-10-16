import React from "react";
import { motion } from "framer-motion";
import { Cog } from "lucide-react";

function Settings() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#fffaf7] via-[#fbefe3] to-[#f4dfc8] dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 transition-colors duration-500 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-2xl shadow-2xl rounded-[2.5rem] p-10 w-full max-w-lg text-center border border-gray-200/60 dark:border-gray-700/60"
      >
        <div className="flex justify-center mb-6">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="p-4 rounded-full bg-gradient-to-tr from-pink-500 to-rose-400 shadow-md"
          >
            <Cog className="w-10 h-10 text-white" />
          </motion.div>
        </div>

        <h1 className="text-3xl font-extrabold mb-3 text-gray-900 dark:text-white">
          Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          This page is under construction 
        </p>
        <p className="text-gray-500 dark:text-gray-500 mt-2">
          Exciting customization features are coming soon!
        </p>
      </motion.div>
    </div>
  );
}

export default Settings;
