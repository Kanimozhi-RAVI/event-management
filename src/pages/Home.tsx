import { events } from "@/data/events";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function Home() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [flippedCards, setFlippedCards] = useState<Set<number | string>>(new Set());

  const navigate = useNavigate();
  
  const handleBook = (event: any) => {
    navigate(`/book/${event.id}`, { state: event });
  };

  // Flip card and auto flip back after 3 seconds
  const handleCardClick = (eventId: number | string) => {
    setFlippedCards(prev => {
      const newSet = new Set(prev);
      newSet.add(eventId);
      return newSet;
    });

    // Auto flip back to front after 3 seconds
    setTimeout(() => {
      setFlippedCards(prev => {
        const newSet = new Set(prev);
        newSet.delete(eventId);
        return newSet;
      });
    }, 4000);
  };

  useEffect(() => {
    setSelectedDate("");
    setSelectedSlot("");
  }, []);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const snap = await getDocs(collection(db, "bookings"));

        const data = snap.docs.map(doc => {
          const d = doc.data();
          return {
            eventId: d.eventId,
            timeSlot: d.timeSlot,
            bookingDate: d.bookingDate?.toDate().toISOString().split("T")[0] || "",
          };
        });

        setBookings(data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
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
      px-4 sm:px-6 md:px-12 lg:px-24 
      py-6 sm:py-8 md:py-10">
      
      {/* Header Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.35,
            },
          },
        }}
        className="mb-12 sm:mb-16 md:mb-24 text-center px-2"
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
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl 
                     font-bold text-[#65C9DA] 
                     leading-tight"
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
          className="mt-3 sm:mt-4 
                     text-gray-600 
                     text-base sm:text-lg md:text-xl
                     max-w-xs sm:max-w-md md:max-w-xl lg:max-w-2xl 
                     mx-auto
                     px-4"
        >
          15+ unique events with interactive flip cards & cinematic experience.
        </motion.p>
      </motion.div>

      {/* Cards Grid */}
      <div className="grid 
                      grid-cols-1 
                      sm:grid-cols-2 
                      lg:grid-cols-3 
                      gap-6 sm:gap-8 md:gap-10 lg:gap-12
                      max-w-7xl mx-auto">
        {availableEvents.map((event, index) => {
          const isFlipped = flippedCards.has(event.id);
          
          return (
            <motion.div
              key={event.id}
              className="relative w-full 
                         h-80 sm:h-96 md:h-[420px]
                         perspective-1000 cursor-pointer
                         mx-auto max-w-sm sm:max-w-none"
              initial={{ opacity: 0, y: 60, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: 1.2,
                delay: index * 0.15,
                ease: "easeInOut",
              }}
              viewport={{ once: true }}
              onClick={() => handleCardClick(event.id)}
            >
              {/* FLIP CARD CONTAINER */}
              <motion.div
                className="relative w-full h-full [transform-style:preserve-3d] 
                           transition-transform duration-700"
                animate={{ 
                  rotateY: isFlipped ? 180 : 0,
                }}
                whileHover={{ 
                  scale: 1.05,
                }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.8 }}
              >
                {/* FRONT */}
                <div className="
                  absolute inset-0 backface-hidden rounded-2xl sm:rounded-3xl 
                  overflow-hidden
                  bg-white
                  border border-[#65C9DA]/30
                  shadow-[0_20px_50px_rgba(0,0,0,0.2)] sm:shadow-[0_25px_60px_rgba(0,0,0,0.25)]
                ">
                  <motion.img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover"
                    initial={{ scale: 1 }}
                    animate={{ scale: isFlipped ? 1 : 1.05 }}
                    transition={{ duration: 0.7 }}
                  />
                  <div className="absolute inset-0 
                                bg-gradient-to-t from-[#65C9DA]/40 via-[#65C9DA]/20 to-transparent
                                flex items-end p-4 sm:p-6">
                    <h2 className="text-xl sm:text-2xl md:text-3xl 
                                 font-bold text-white 
                                 drop-shadow-lg">
                      {event.title}
                    </h2>
                  </div>
                  
                  {/* Tap indicator for mobile */}
                  <div className="absolute top-4 right-4 
                                  bg-white/90 backdrop-blur-sm
                                  rounded-full p-2
                                  sm:hidden
                                  shadow-lg">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-5 w-5 text-[#65C9DA]" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" 
                      />
                    </svg>
                  </div>
                </div>

                {/* BACK */}
                <motion.div
                  className="
                    absolute inset-0 rotate-y-180 backface-hidden 
                    rounded-2xl sm:rounded-3xl
                    flex flex-col justify-center items-center 
                    p-5 sm:p-6 md:p-8
                    text-center

                    bg-gradient-to-br 
                    from-[#EAF7FA] 
                    via-[#BFE9F2] 
                    to-[#65C9DA]
                    text-[#1F6F82]

                    border border-white/20
                    shadow-[0_25px_70px_rgba(101,201,218,0.5)] 
                    sm:shadow-[0_30px_80px_rgba(101,201,218,0.6)]
                  "
                >
                  {/* Title */}
                  <h2 className="text-2xl sm:text-3xl md:text-4xl 
                               font-extrabold drop-shadow-md
                               mb-2 sm:mb-3">
                    {event.title}
                  </h2>

                  {/* Description */}
                  <p className="mt-2 sm:mt-4 
                              text-sm sm:text-base md:text-lg
                              text-white/90
                              line-clamp-3 sm:line-clamp-4
                              px-2">
                    {event.desc}
                  </p>

                  {/* Button */}
                  <Button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent card flip when clicking button
                      handleBook(event);
                    }}
                    className="
                      mt-4 sm:mt-6 
                      px-6 sm:px-8 
                      py-4 sm:py-5 
                      rounded-xl
                      text-base sm:text-lg md:text-xl 
                      font-extrabold tracking-wide

                      bg-white text-[#2C8FA3]
                      shadow-[0_8px_25px_rgba(0,0,0,0.2)] 
                      sm:shadow-[0_10px_30px_rgba(0,0,0,0.25)]

                      hover:scale-105 sm:hover:scale-110
                      hover:bg-[#F1FBFD]
                      active:scale-95
                      transition-all duration-300

                      w-full sm:w-auto
                      max-w-xs
                    "
                  >
                    <span className="hidden sm:inline">✨ </span>
                    Book Your Dream Event
                    <span className="hidden sm:inline"> ✨</span>
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}