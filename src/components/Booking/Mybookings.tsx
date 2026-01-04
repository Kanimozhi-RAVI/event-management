import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Ticket, 
  X, 
  CheckCircle, 
  Calendar, 
  Clock, 
  User, 
  Mail, 
  Phone,
  Sparkles,
  PartyPopper
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { cancelBookingRequest, getUserBookingsRequest } from '../../Redux/Actions/BookingActions';
import type { RootState } from '@/store';
import { useAuth } from '@/contexts/AuthContext';

type TabType = 'upcoming' | 'past' | 'cancelled';
type BookingStatus = "upcoming" | "past" | "cancelled";
interface TimeSlot {
  start: string;
  end: string;
  startIndex: number;
  endIndex: number;
  hours: number;
}
interface Booking {
  id: string;
  eventId?: string;
  eventTitle: string;
  bookingDate: any;
  timeSlot: TimeSlot;
  foodDecoration: string;
  decorationTheme: string;
  status: TabType;
  name: string;
  email: string;
  phone: string;
  createdAt?: any;
}

const MyBookings = () => {
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = useState<TabType>('upcoming');
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // FIX 1: Access bookings from correct reducer path
    const { user } = useAuth();
  const { bookings, loading, error } = useSelector(
    (state: RootState) => state.bookings // Make sure this matches your reducer name
  );

  console.log('User:', user);
  console.log('Bookings from redux:', bookings);
  console.log('Loading:', loading);
  console.log('Error:', error);

  useEffect(() => {
    if (user?.uid) {
      console.log("🚀 Dispatching bookings for", user.uid);
      dispatch(getUserBookingsRequest(user.uid));
    }
  }, [user, dispatch]);

  // FIX 2: Single useEffect for handling cancel completion
  useEffect(() => {
    if (!cancellingId) return;
    
    // Reset cancelling state after bookings update
    const timer = setTimeout(() => {
      setCancellingId(null);
      toast({
        title: "Booking Cancelled",
        description: "Your booking has been successfully cancelled.",
      });
    }, 500);

    return () => clearTimeout(timer);
  }, [bookings, cancellingId, toast]);

const handleCancelBooking = (bookingId: string) => {
  setCancellingId(bookingId);
  dispatch(cancelBookingRequest(bookingId));
};


// start of today

const now = new Date();
now.setHours(0, 0, 0, 0);



const normalizedBookings: Booking[] = (bookings || []).map((b: Booking) => {
  let bookingDate: Date;

  if (b.bookingDate?.toDate) {
    bookingDate = b.bookingDate.toDate(); // ✅ Firestore Timestamp → Date
  } else if (b.bookingDate?.seconds) {
    bookingDate = new Date(b.bookingDate.seconds * 1000); // ✅ another Timestamp
  } else {
    bookingDate = new Date(b.bookingDate); // fallback
  }

  bookingDate.setHours(0, 0, 0, 0);

  let status: BookingStatus =
    b.status ?? (bookingDate >= now ? 'upcoming' : 'past');

  return { ...b, bookingDate, status };
});

const filteredBookings = normalizedBookings.filter(
  (b) => b.status === selectedTab
);


  const tabs = [
    { id: 'upcoming' as TabType, label: 'Upcoming Events', icon: Calendar, color: 'from-[#1FA8B8] to-[#158894]' },
    { id: 'past' as TabType, label: 'Past Events', icon: Clock, color: 'from-gray-500 to-gray-600' },
    { id: 'cancelled' as TabType, label: 'Cancel Events', icon: X, color: 'from-red-500 to-red-600' }
  ];

// Replace your handleEditBooking function in MyBookings.tsx with this:

const handleEditBooking = (booking: any) => {
  // Convert to Date object
  let selectedDate: Date;
  
  if (booking.bookingDate instanceof Date) {
    selectedDate = booking.bookingDate;
  } else if (booking.bookingDate?.toDate) {
    selectedDate = booking.bookingDate.toDate();
  } else if (booking.bookingDate?.seconds) {
    selectedDate = new Date(booking.bookingDate.seconds * 1000);
  } else {
    selectedDate = new Date(booking.bookingDate);
  }

  // ✅ FIX: Format using LOCAL time, not UTC
  const year = selectedDate.getFullYear();
  const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
  const day = String(selectedDate.getDate()).padStart(2, '0');
  const selectedDateForInput = `${year}-${month}-${day}`;

  console.log("🔹 Computed selectedDate:", selectedDate);
  console.log("🔹 Date string for input:", selectedDateForInput);

  navigate(`/book/${booking.id}`, {
    state: {
      booking: {
        bookingId: booking.id,
        name: booking.name,
        phone: booking.phone,
        selectedDate: selectedDateForInput, // ✅ Now using local time
        selectedSlot: {
          start: booking.timeSlot.start,
          end: booking.timeSlot.end,
          startIndex: booking.timeSlot.startIndex,
          endIndex: booking.timeSlot.endIndex,
          hours: booking.timeSlot.hours
        },
        foodDecoration: booking.foodDecoration,
        decorationTheme: booking.decorationTheme,
        title: booking.eventTitle,
      }
    }
  });
};

  const getStatusBadge = (status: TabType) => {
    switch (status) {
      case 'upcoming':
        return (
          <Badge className="px-2 py-0.5 text-xs bg-[#1FA8B8]/20 text-[#1FA8B8] border border-[#1FA8B8]/50 inline-flex items-center gap-1 font-semibold w-fit">
            <CheckCircle className="w-4 h-4" /> Confirmed
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge className="px-2 py-0.5 text-xs bg-red-500/20 text-red-500 border border-red-500/50 inline-flex items-center gap-1 font-semibold w-fit">
            <X className="w-4 h-4" /> Cancelled
          </Badge>
        );
      case 'past':
        return (
          <Badge className="px-2 py-0.5 text-xs bg-gray-500/20 text-gray-600 border border-gray-500/50 inline-flex items-center gap-1 font-semibold w-fit">
            <CheckCircle className="w-4 h-4" /> Completed
          </Badge>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F5F5F5]">
      
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 text-gray-600 font-medium text-lg"
        >
          Loading your bookings...
        </motion.p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-10 mt-20">
      {/* Header Section */}
    

      <div className="container mx-auto max-w-6xl px-4 -mt-6">
        {/* Tabs */}
<motion.div
  initial={{ y: 50, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  transition={{ delay: 0.2 }}
  className="relative flex gap-8 mb-8 overflow-x-auto pb-2" // <-- increased gap
>
  {/* Full stable line under all tabs */}
<div className="" />


{tabs.map((tab) => {
  const Icon = tab.icon;
  const count = normalizedBookings.filter(
    (b) => b.status === tab.id
  ).length;

  return (
    <div key={tab.id} className="relative flex flex-col items-center min-w-[120px]">
      <button
        onClick={() => setSelectedTab(tab.id)}
        className={`relative flex items-center gap-2 py-2 font-semibold transition-colors duration-300 ${
          selectedTab === tab.id
            ? "text-[#1FA8B8]"
            : "text-gray-600 hover:text-gray-800"
        }`}
      >
        <Icon className="w-5 h-5" />
        <span>{tab.label}</span>

        <Badge
          className={`ml-1 text-xs ${
            selectedTab === tab.id
              ? "bg-[#1FA8B8] text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          {count}
        </Badge>
      </button>

      {/* 🔥 Only active tab underline */}
      {selectedTab === tab.id && (
        <motion.div
          layoutId="activeTabUnderline"
          className="absolute -bottom-[2px] h-[3px] w-full bg-[#1FA8B8] rounded-full"
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      )}
    </div>
  );
})}


  {/* Moving indicator under selected tab */}

</motion.div>




        {/* Bookings List */}
        <AnimatePresence mode="wait">
          {filteredBookings.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center py-20"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
                className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-[#1FA8B8]/20 to-[#158894]/20 rounded-full flex items-center justify-center"
              >
                <Ticket className="w-16 h-16 text-[#1FA8B8]" />
              </motion.div>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold text-gray-800 mb-2"
              >
                No {selectedTab} bookings
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-gray-500"
              >
                {selectedTab === 'upcoming' && "Start booking events to see them here"}
                {selectedTab === 'past' && "Your completed bookings will appear here"}
                {selectedTab === 'cancelled' && "No cancelled bookings"}
              </motion.p>
            </motion.div>
          ) : (
            <motion.div
              key={selectedTab}
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1
                  }
                }
              }}
              className="space-y-4"
            >
              {filteredBookings.map((booking :Booking) => (
                <motion.div
                  key={booking.id}
                  variants={{
                    hidden: { y: 50, opacity: 0 },
                    visible: {
                      y: 0,
                      opacity: 1,
                      transition: {
                        type: 'spring',
                        stiffness: 100
                      }
                    }
                  }}
                  whileHover={{ scale: 1.02 }}
                  className="group"
                >
                  <Card className="overflow-hidden bg-white border-0 shadow-lg hover:shadow-2xl transition-all duration-300">
                    <div className={`h-2 bg-gradient-to-r ${
                      booking.status === 'upcoming' ? 'from-[#1FA8B8] to-[#158894]' :
                      booking.status === 'cancelled' ? 'from-red-500 to-red-600' :
                      'from-gray-400 to-gray-500'
                    }`} />
                    
                    <div className="p-6">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                        <div className="flex-1">
                          <div className="flex items-start gap-3 mb-3">
                            <motion.div
                              initial={{ rotate: -10 }}
                              animate={{ rotate: 0 }}
                              transition={{ type: 'spring', stiffness: 200 }}
                              className="w-12 h-12 bg-gradient-to-br from-[#1FA8B8] to-[#158894] rounded-xl flex items-center justify-center flex-shrink-0"
                            >
                              <PartyPopper className="w-6 h-6 text-white" />
                            </motion.div>
                            <div>
                              <h3 className="text-xl font-bold text-gray-800 mb-1">
                                {booking.eventTitle || 'Event'}
                              </h3>
                              <p className="text-sm text-gray-500">
                                Booking ID: <span className="font-mono font-semibold text-[#1FA8B8]">{booking.id}</span>
                              </p>
                            </div>
                          </div>
                          {getStatusBadge(booking.status)}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="space-y-3">
                          <div className="flex items-center gap-3 text-gray-700">
                            <div className="w-8 h-8 bg-[#1FA8B8]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                              <User className="w-4 h-4 text-[#1FA8B8]" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Name</p>
                              <p className="font-semibold">{booking.name}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 text-gray-700">
                            <div className="w-8 h-8 bg-[#1FA8B8]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                              <Mail className="w-4 h-4 text-[#1FA8B8]" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Email</p>
                              <p className="font-semibold text-sm">{booking.email}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 text-gray-700">
                            <div className="w-8 h-8 bg-[#1FA8B8]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                              <Phone className="w-4 h-4 text-[#1FA8B8]" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Phone</p>
                              <p className="font-semibold">{booking.phone}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 text-gray-700">
                            <div className="w-8 h-8 bg-[#1FA8B8]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                              <Calendar className="w-4 h-4 text-[#1FA8B8]" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Event Date</p>
                              <p className="font-semibold">{booking.bookingDate.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center gap-3 text-gray-700">
                            <div className="w-8 h-8 bg-[#1FA8B8]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                              <Clock className="w-4 h-4 text-[#1FA8B8]" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Time Slot</p>
                              <p className="font-semibold">
  {booking.timeSlot
    ? `${booking.timeSlot.start} to ${booking.timeSlot.end} (${booking.timeSlot.hours} hrs)`
    : 'Not specified'}
</p>

                            </div>
                          </div>

                          <div className="flex items-center gap-3 text-gray-700">
                            <div className="w-8 h-8 bg-[#1FA8B8]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                              <Sparkles className="w-4 h-4 text-[#1FA8B8]" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Package</p>
                              <p className="font-semibold">{booking.foodDecoration}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 text-gray-700">
                            <div className="w-8 h-8 bg-[#1FA8B8]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                              <PartyPopper className="w-4 h-4 text-[#1FA8B8]" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Theme</p>
                              <p className="font-semibold">{booking.decorationTheme || 'Standard'}</p>
                            </div>
                          </div>

                          <div className="text-xs text-gray-500 pt-2">
                            <p>Booked on: {booking.createdAt?.toDate ? booking.createdAt.toDate().toLocaleDateString() : '—'}</p>
                          </div>
                        </div>
                      </div>

                      {booking.status === 'upcoming' && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                          className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100"
                        >
                          <Button
                            onClick={() => handleCancelBooking(booking.id,)}
                            disabled={cancellingId === booking.id}
                            variant="outline"
                            className="w-40 border-2 border-red-400 text-red-500 hover:bg-red-50 hover:border-red-500 font-semibold h-10"
                          >
                            {cancellingId === booking.id ? (
                              <motion.div
                                className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                              />
                            ) : (
                              <>
                                <X className="w-4 h-4 mr-2" />
                                Cancel Booking
                              </>
                            )}
                          </Button>
                          <Button
                            onClick={() => handleEditBooking(booking)}
                            variant="default"
                            className="w-40 font-semibold h-10 bg-[#1FA8B8] hover:bg-[#158894]"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" /> Edit Booking
                          </Button>
                        </motion.div>
                      )}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MyBookings;