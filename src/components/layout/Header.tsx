import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Home, LogOut, UserCircle } from "lucide-react"; 
import logo from "@/assets/logo.png";
import { getUserBookingsRequest } from "../../Redux/Actions/BookingActions";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../rootReducer";
import { logoutRequest } from "../../Redux/Actions/AuthAction";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logoutRequest());
  };

  // Helper to check if nav is active
  const isActive = (path: string) => location.pathname === path;

  return (
    <motion.header className="bg-[#36A7B5] text-white flex items-center justify-between px-6 py-3 shadow-lg relative z-50">
      {/* Logo */}
      <div
        onClick={() => navigate("/dashboard")}
        className="flex items-center gap-4 cursor-pointer"
      >
        <img src={logo} className="h-10" />
      </div>

      {/* Navigation */}
 <nav className="flex items-center gap-4">
  <button
    onClick={() => navigate("/dashboard")}
    className={`flex items-center gap-2 px-4 py-2 rounded-md font-semibold transition ${
      isActive("/dashboard")
        ? "bg-white text-[#36A7B5]" // ✅ Active style
        : "bg-transparent text-white hover:bg-white hover:text-[#36A7B5]"
    }`}
  >
    <Home size={16} /> Home
  </button>

  <button
    onClick={() => {
      navigate("/my-bookings");
      if (user?.uid) dispatch(getUserBookingsRequest(user.uid));
    }}
    className={`flex items-center gap-2 px-4 py-2 rounded-md font-semibold transition ${
      isActive("/my-bookings")
        ? "bg-white text-[#36A7B5]" // ✅ Active style
        : "bg-transparent text-white hover:bg-white hover:text-[#36A7B5]"
    }`}
  >
    <Calendar size={16} /> My Bookings
  </button>

  {/* Profile / Logout Dropdown */}
  <div
    className="relative"
    onMouseEnter={() => setDropdownOpen(true)}
    onMouseLeave={() => setDropdownOpen(false)}
  >
    <UserCircle size={28} className="cursor-pointer" />

    <AnimatePresence>
      {dropdownOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="absolute right-0 mt-2 w-40 bg-white text-gray-800 rounded-md shadow-lg overflow-hidden"
        >
          {user?.displayName && (
           <div className="px-4 py-2 border-b text-gray-700 font-medium flex items-center gap-2 bg-white rounded-md shadow-sm">
  <UserCircle size={20} className="text-gray-500" />
  <span>{user.displayName}</span>
</div>

          )}
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 text-left px-4 py-2 hover:bg-gray-100 transition"
          >
            <LogOut size={16} /> Logout
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
</nav>


    </motion.header>
  );
};

export default Header;
