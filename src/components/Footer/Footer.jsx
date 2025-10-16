import React from "react";
import { Link } from "react-router-dom";
import Logo from "../Logo";
import { motion } from "framer-motion";
import { FaTwitter, FaGithub, FaLinkedin } from "react-icons/fa";

function Footer() {
  return (
    <footer
      className="relative overflow-hidden mt-16 mx-4 md:mx-8 mb-6 
      bg-gradient-to-br from-[#fdf6ef]/90 via-[#f8e8d9]/90 to-[#e7d3be]/90
      dark:from-gray-800/80 dark:via-gray-750/80 dark:to-gray-700/80
      backdrop-blur-md shadow-lg border border-gray-200/60 dark:border-gray-700/60
      rounded-3xl transition-all duration-500 hover:shadow-2xl"
    >
      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-8 py-10">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Logo & Copy */}
          <div className="flex flex-col justify-between">
            <div className="mb-4">
              <Logo width="100px" />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © {new Date().getFullYear()} Blogify. All Rights Reserved.
            </p>

            {/* Social icons */}
            <div className="flex space-x-4 mt-4">
              <motion.a
                whileHover={{ scale: 1.2 }}
                href="https://twitter.com/"
                className="text-gray-500 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
              >
                <FaTwitter size={20} />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.2 }}
                href="https://github.com/"
                className="text-gray-500 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
              >
                <FaGithub size={20} />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.2 }}
                href="https://linkedin.com/"
                className="text-gray-500 hover:text-blue-700 dark:hover:text-blue-400 transition-colors"
              >
                <FaLinkedin size={20} />
              </motion.a>
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-300">
              Company
            </h3>
            <ul className="space-y-2">
              {["Features", "Pricing", "Affiliate Program", "Press Kit"].map(
                (item) => (
                  <li key={item}>
                    <Link
                      to="/"
                      className="text-gray-700 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      {item}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-300">
              Support
            </h3>
            <ul className="space-y-2">
              {["Account", "Help", "Contact Us", "Customer Support"].map(
                (item) => (
                  <li key={item}>
                    <Link
                      to="/"
                      className="text-gray-700 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      {item}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Legals */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-300">
              Legals
            </h3>
            <ul className="space-y-2">
              {["Terms & Conditions", "Privacy Policy", "Licensing"].map(
                (item) => (
                  <li key={item}>
                    <Link
                      to="/"
                      className="text-gray-700 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      {item}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
