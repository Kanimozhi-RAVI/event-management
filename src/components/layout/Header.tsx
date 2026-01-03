import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Home, LogOut, UserCircle, Menu, X } from "lucide-react"; 
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logoutRequest());
    setMobileMenuOpen(false);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
    if (path === "/my-bookings" && user?.uid) {
      dispatch(getUserBookingsRequest(user.uid));
    }
  };


  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <motion.header 
        className="bg-[#36A7B5] text-white flex items-center justify-between 
                   px-4 sm:px-6 md:px-8 
                   py-3 sm:py-4
                   shadow-lg relative z-50"
      >
        {/* Logo */}
        <div
          onClick={() => handleNavigation("/dashboard")}
          className="flex items-center gap-2 sm:gap-4 cursor-pointer"
        >
          <img src={logo} className="h-8 sm:h-10 md:h-12" alt="Logo" />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-3 lg:gap-4">
          <button
            onClick={() => handleNavigation("/dashboard")}
            className={`flex items-center gap-2 px-3 lg:px-4 py-2 rounded-md font-semibold transition text-sm lg:text-base ${
              isActive("/dashboard")
                ? "bg-white text-[#36A7B5]"
                : "bg-transparent text-white hover:bg-white hover:text-[#36A7B5]"
            }`}
          >
            <Home size={16} /> Home
          </button>

          <button
            onClick={() => handleNavigation("/my-bookings")}
            className={`flex items-center gap-2 px-3 lg:px-4 py-2 rounded-md font-semibold transition text-sm lg:text-base ${
              isActive("/my-bookings")
                ? "bg-white text-[#36A7B5]"
                : "bg-transparent text-white hover:bg-white hover:text-[#36A7B5]"
            }`}
          >
            <Calendar size={16} /> My Bookings
          </button>

          {/* Profile / Logout Dropdown - Desktop */}
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
                    <div className="px-4 py-2 border-b text-gray-700 font-medium flex items-center gap-2 bg-white">
                      <UserCircle size={20} className="text-gray-500" />
                      <span className="truncate">{user.displayName}</span>
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

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 hover:bg-white/10 rounded-lg transition"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </motion.header>

   
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
           
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-64 sm:w-72 
                         bg-white shadow-2xl z-50 md:hidden
                         flex flex-col"
            >
              {/* Mobile Menu Header */}
              <div className="bg-[#36A7B5] text-white p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UserCircle size={24} />
                  <span className="font-semibold truncate">
                    {user?.displayName || "Menu"}
                  </span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 hover:bg-white/10 rounded"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Mobile Menu Items */}
              <nav className="flex flex-col p-4 gap-2">
                <button
                  onClick={() => handleNavigation("/dashboard")}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition text-left ${
                    isActive("/dashboard")
                      ? "bg-[#36A7B5] text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Home size={20} />
                  <span>Home</span>
                </button>

                <button
                  onClick={() => handleNavigation("/my-bookings")}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition text-left ${
                    isActive("/my-bookings")
                      ? "bg-[#36A7B5] text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Calendar size={20} />
                  <span>My Bookings</span>
                </button>

                {/* Divider */}
                <div className="border-t my-2" />

                {/* Profile Info */}
                {user?.displayName && (
                  <div className="px-4 py-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Logged in as</p>
                    <p className="font-semibold text-gray-800 truncate">
                      {user.displayName}
                    </p>
                    {user?.email && (
                      <p className="text-xs text-gray-600 truncate mt-1">
                        {user.email}
                      </p>
                    )}
                  </div>
                )}

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg 
                           text-red-600 hover:bg-red-50 font-semibold transition text-left
                           mt-2"
                >
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;