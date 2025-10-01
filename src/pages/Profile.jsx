// src/pages/Profile.jsx
import React from "react";
import { useSelector } from "react-redux";

function Profile() {
  const { userData } = useSelector((state) => state.auth);

  if (!userData) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-6 w-full max-w-md text-center">
          <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100">
            Not Logged In
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Please log in to view your profile.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-8 w-full max-w-md transform hover:scale-[1.01] transition-all duration-300">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100 text-center">
          Profile
        </h2>
        <div className="space-y-5">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
            <p className="font-medium text-gray-800 dark:text-gray-200">
              {userData.user.name}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
            <p className="font-medium text-gray-800 dark:text-gray-200">
              {userData.user.email}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Role</p>
            <p className="font-medium capitalize text-gray-800 dark:text-gray-200">
              {userData.user.role}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Joined</p>
            <p className="font-medium text-gray-800 dark:text-gray-200">
              {new Date(userData.user.$createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
