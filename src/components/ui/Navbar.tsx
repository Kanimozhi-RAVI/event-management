import { signOut } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { motion } from "framer-motion";

export default function Navbar() {
  const handleLogout = () => {
    signOut(auth);
  };

  return (
    <nav className="flex justify-between items-center p-4 bg-white shadow-md">
      <h1 className="text-xl font-bold text-primary">Event Booker</h1>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleLogout}
        className="bg-secondary text-white px-4 py-2 rounded"
      >
        Logout
      </motion.button>
    </nav>
  );
}
