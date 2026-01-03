// src/components/layout/Footer.tsx
import React from "react";
import { motion } from "framer-motion";

const Footer: React.FC = () => {
  return (
    <motion.footer
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-[#36A7B5] text-white text-center p-4 shadow-sm"
    >
      © 2026 GoFloaters. All Rights Reserved.
    </motion.footer>
  );
};

export default Footer;
