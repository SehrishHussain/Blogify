import React from "react";
import { useDispatch } from "react-redux";
import { authService } from "../../services";
import { logout } from "../../store/authSlice";

function LogoutBtn() {
  const dispatch = useDispatch();

  const logoutHandler = async () => {
    try {
      await authService.logout();
      dispatch(logout());

      // 🔹 Create a notification element dynamically
      const note = document.createElement("div");
      note.textContent = "You have logged out successfully";
      note.className = `
        fixed inset-0 flex items-center justify-center
        text-lg font-semibold text-white
        bg-black/60 backdrop-blur-sm
        z-[9999] opacity-0 transition-opacity duration-500
      `;
      document.body.appendChild(note);

      // 🔹 Trigger fade-in
      requestAnimationFrame(() => (note.style.opacity = "1"));

      // 🔹 Fade-out after 1.5 s
      setTimeout(() => {
        note.style.opacity = "0";
        // 🔹 Refresh after fade-out (2 s total)
        setTimeout(() => {
          note.remove();
          document.body.classList.add(
            "opacity-0",
            "transition-opacity",
            "duration-500"
          );
          setTimeout(() => window.location.reload(), 500);
        }, 500);
      }, 1500);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <button
      className="block w-full text-left px-6 py-2 duration-200 hover:bg-[#e2cbb8] dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 transform hover:scale-105"
      onClick={logoutHandler}
    >
      Logout
    </button>
  );
}

export default LogoutBtn;
