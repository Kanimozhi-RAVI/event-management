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
import type { RootState } from '../rootReducer';
import { cancelBookingRequest, getUserBookingsRequest } from '../Redux/Actions/BookingActions';

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
  const user = useSelector((state: RootState) => state.auth.user);
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

  // FIX 3: Handle cancel with both bookingId and eventId
  const handleCancelBooking = (bookingId: string, eventId?: string) => {
    setCancellingId(bookingId);
    dispatch(cancelBookingRequest(bookingId, eventId));
  };


// start of today

const now = new Date();
now.setHours(0, 0, 0, 0);

const filteredBookings = (bookings || []).map((b: Booking) => {
  // Convert Firebase Timestamp or plain date to JS Date
  let bookingDate: Date;
  if (b.bookingDate?.toDate) {
    bookingDate = b.bookingDate.toDate();
  } else if (b.bookingDate?.seconds) {
    bookingDate = new Date(b.bookingDate.seconds * 1000);
  } else {
    bookingDate = new Date(b.bookingDate);
  }
  bookingDate.setHours(0, 0, 0, 0); // normalize for date comparison

  // Determine status if not explicitly set
  let status: BookingStatus = b.status ?? (bookingDate >= now ? 'upcoming' : 'past');

  return { ...b, bookingDate, status };
}).filter((b: Booking) => b.status === selectedTab);



  const tabs = [
    { id: 'upcoming' as TabType, label: 'Upcoming', icon: Calendar, color: 'from-[#1FA8B8] to-[#158894]' },
    { id: 'past' as TabType, label: 'Past Events', icon: Clock, color: 'from-gray-500 to-gray-600' },
    { id: 'cancelled' as TabType, label: 'Cancelled', icon: X, color: 'from-red-500 to-red-600' }
  ];

  const handleEditBooking = (booking: any) => {
    navigate(`/book/${booking.id}`, {
      state: {
        booking: {
          bookingId: booking.id,
          name: booking.name,
          phone: booking.phone,
          selectedDate: booking.bookingDate,
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
    console.log(booking);
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
        <motion.div
          className="relative w-24 h-24"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              boxShadow: 'inset 0 0 0 1rem #1FA8B8',
              filter: 'drop-shadow(0 0 1rem rgba(31, 168, 184, 0.5))',
            }}
            animate={{
              boxShadow: ['inset 0 0 0 1rem #1FA8B8', 'inset 0 0 0 0 #1FA8B8'],
              opacity: [1, 0],
            }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute rounded-full"
            style={{
              width: 'calc(100% - 2rem)',
              height: 'calc(100% - 2rem)',
              filter: 'drop-shadow(0 0 1rem rgba(31, 168, 184, 0.5))',
            }}
            animate={{
              boxShadow: ['0 0 0 0 #1FA8B8', '0 0 0 1rem #1FA8B8'],
              opacity: [0, 1],
            }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
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
    <div className="min-h-screen bg-[#F5F5F5] pb-12">
      {/* Header Section */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-gradient-to-r from-[#1FA8B8] to-[#158894] text-white py-12 px-4 relative overflow-hidden"
      >
        <motion.div
          className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -20, 0],
            y: [0, 20, 0],
          }}
          transition={{ duration: 6, repeat: Infinity }}
        />

        <div className="container mx-auto max-w-6xl relative z-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="flex items-center gap-3 mb-4"
          >
            <div className="w-14 h-14 bg-white/20 backdrop-blur-lg rounded-2xl flex items-center justify-center">
              <Ticket className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">My Bookings</h1>
              <p className="text-white/80 text-sm">Manage all your event bookings</p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <div className="container mx-auto max-w-6xl px-4 -mt-6">
        {/* Tabs */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex gap-3 mb-8 overflow-x-auto pb-2"
        >
         {tabs.map((tab, index) => {
  const Icon = tab.icon;

  const count = (bookings || []).filter((b: Booking) => {
    // Use status from booking, fallback to 'upcoming'
    const status = b.status || 'upcoming';
    return status === tab.id;
  }).length;  
            
            return (
              <motion.button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`relative px-6 py-4 rounded-2xl font-semibold whitespace-nowrap transition-all duration-300 flex items-center gap-3 min-w-[160px] ${
                  selectedTab === tab.id
                    ? 'bg-white text-gray-800 shadow-xl'
                    : 'bg-white/60 text-gray-600 hover:bg-white hover:shadow-lg'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {selectedTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className={`absolute inset-0 bg-gradient-to-r ${tab.color} rounded-2xl opacity-10`}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon className={`w-5 h-5 ${selectedTab === tab.id ? 'text-[#1FA8B8]' : ''}`} />
                <span className="relative z-10">{tab.label}</span>
                <Badge className={`relative z-10 ${
                  selectedTab === tab.id 
                    ? 'bg-[#1FA8B8] text-white' 
                    : 'bg-gray-200 text-gray-700'
                }`}>
                  {count}
                </Badge>
              </motion.button>
            );
          })}
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
              {filteredBookings.map((booking) => (
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
                            onClick={() => handleCancelBooking(booking.id, booking.eventId)}
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