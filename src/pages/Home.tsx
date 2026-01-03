import { events } from "@/data/events";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/ui/Navbar";
import { useEffect, useState } from "react";
import { collection, getDoc } from "firebase/firestore";

export default function Home() {
  const [bookings, setBookings] = useState<any[]>([]);
const [selectedDate, setSelectedDate] = useState("");
const [selectedSlot, setSelectedSlot] = useState("");

  const navigate = useNavigate();
    const handleBook = (event: any) => {
    navigate(`/book/${event.id}`, { state: event });
  };
  useEffect(() => {
  const fetchBookings = async () => {
    const snap = await getDoc(collection(db, "bookings"));

    const data = snap.docs.map(doc => {
      const d = doc.data();
      return {
        eventId: d.eventId,
        timeSlot: d.timeSlot,
        bookingDate: d.bookingDate
          .toDate()
          .toISOString()
          .split("T")[0],
      };
    });

    setBookings(data);
  };

  fetchBookings();
}, []);
const availableEvents = events.filter(event => {
  if (!selectedDate || !selectedSlot) return true;

  const isBooked = bookings.some(
    booking =>
      booking.eventId === event.id &&
      booking.bookingDate === selectedDate &&
      booking.timeSlot === selectedSlot
  );

  return !isBooked;
});


  return (
    <div className="min-h-screen 
  bg-gradient-to-b from-[#F8FEFF] via-[#F1FBFD] to-[#EAF7FA]
  relative overflow-hidden
  px-6 md:px-24 py-24">
<motion.div
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true }}
  variants={{
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.35, // slow gap between items
      },
    },
  }}
  className="mb-24 text-center"
>
  <motion.h1
    variants={{
      hidden: { opacity: 0, y: -60 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration: 1.6,
          ease: "easeOut",
        },
      },
    }}
    className="text-4xl md:text-6xl font-bold text-[#65C9DA]"
  >
    Explore Our Events
  </motion.h1>

  <motion.p
    variants={{
      hidden: { opacity: 0, y: 40 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration: 1.6,
          ease: "easeOut",
        },
      },
    }}
    className="mt-4 text-gray-600 text-lg max-w-xl mx-auto"
  >
    15+ unique events with interactive flip cards & cinematic experience.
  </motion.p>
</motion.div>


      {/* Cards Grid */}
      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
       {availableEvents.map((event, index) => (
          <motion.div
            key={event.id}
            className="relative w-full h-96 perspective-1000 cursor-pointer"
            initial={{ opacity: 0, y: 60, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 1.2,
              delay: index * 0.15,
              ease: "easeInOut",
            }}
            viewport={{ once: true }}
          >
            {/* FLIP CARD CONTAINER */}
            <motion.div
              className="relative w-full h-full [transform-style:preserve-3d] transition-transform duration-700"
              whileHover={{ rotateY: 180, scale: 1.05 }}
            >
              {/* FRONT */}
             <div className="
  absolute inset-0 backface-hidden rounded-3xl overflow-hidden
  bg-white
  border border-[#65C9DA]/30
  shadow-[0_25px_60px_rgba(0,0,0,0.25)]
">

                <motion.img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover"
                  initial={{ scale: 1.05 }}
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.7 }}
                />
                <div className="absolute inset-0 bg-[#65C9DA]/20 flex items-end p-6">
                  <h2 className="text-2xl font-bold text-white">{event.title}</h2>
                </div>
              </div>

              {/* BACK */}

              
          {/* BACK */}
<motion.div
  className="
    absolute inset-0 rotate-y-180 backface-hidden rounded-3xl
    flex flex-col justify-center items-center p-6 text-center

   bg-gradient-to-br 
from-[#EAF7FA] 
via-[#BFE9F2] 
to-[#65C9DA]
text-[#1F6F82]


    border border-white/20
    shadow-[0_30px_80px_rgba(101,201,218,0.6)]
  "
>
  {/* Title */}
  <h2 className="text-3xl font-extrabold drop-shadow-md">
    {event.title}
  </h2>

  {/* Description */}
  <p className="mt-4 text-white/90">
    {event.desc}
  </p>

  {/* Button */}
  <Button
    onClick={() => handleBook(event)}
    className="
      mt-6  py-5 rounded-xl
      text-xl font-extrabold tracking-wide

      bg-white text-[#2C8FA3]
      shadow-[0_10px_30px_rgba(0,0,0,0.25)]

      hover:scale-110
      hover:bg-[#F1FBFD]
      active:scale-95
      transition-all duration-300
    "
  >
    ✨ Book Your Dream Event ✨
  </Button>
</motion.div>



            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
