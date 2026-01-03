import { motion } from "framer-motion";

export default function PageLoader() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#F5F5F5]">
      <motion.div
        className="relative w-24 h-24"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            boxShadow: "inset 0 0 0 1rem #65C9DA",
            filter: "drop-shadow(0 0 1rem rgba(101,201,218,0.6))",
          }}
          animate={{
            boxShadow: [
              "inset 0 0 0 1rem #65C9DA",
              "inset 0 0 0 0 #65C9DA",
            ],
            opacity: [1, 0],
          }}
          transition={{ duration: 2.5, repeat: Infinity }}
        />

        <motion.div
          className="absolute rounded-full"
          style={{
            width: "calc(100% - 2rem)",
            height: "calc(100% - 2rem)",
          }}
          animate={{
            boxShadow: [
              "0 0 0 0 #65C9DA",
              "0 0 0 1rem #65C9DA",
            ],
            opacity: [0, 1],
          }}
          transition={{ duration: 2.5, repeat: Infinity }}
        />
      </motion.div>

      <p className="mt-6 text-gray-600 font-medium text-lg">
        Loading...
      </p>
    </div>
  );
}
