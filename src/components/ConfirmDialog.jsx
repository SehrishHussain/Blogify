import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ConfirmDialog({ open, onClose, onConfirm, message }) {
  // Allow closing with ESC key
  useEffect(() => {
    if (!open) return;
    const handler = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Background overlay */}
          <div
            className="absolute inset-0 bg-black bg-opacity-40"
            onClick={onClose}
          />

          {/* Dialog */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative bg-white dark:bg-gray-800 rounded-xl p-6 shadow-2xl max-w-sm w-full z-10"
          >
            {/* Message */}
            <p className="text-gray-800 dark:text-gray-200 mb-5 text-center text-base">
              {message}
            </p>

            {/* Actions */}
            <div className="flex justify-center gap-4">
              <button
                className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 focus:ring-2 focus:ring-gray-300 focus:outline-none transition"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                className="px-5 py-2 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 focus:ring-2 focus:ring-red-400 focus:outline-none transition"
                onClick={onConfirm}
              >
                Delete
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
