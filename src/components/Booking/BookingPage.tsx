import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  addDoc,
  collection,
  Timestamp,
  query,
  where,
  getDocs,
  updateDoc,
  doc
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Check,
  Lock,
  CheckCircle2,
  Sparkles,
  Mail
} from "lucide-react";
import eventimage from '../../assets/event.jpg';
import { useDispatch, useSelector } from "react-redux";
import { createBookingRequest, updateBookingRequest } from "../Redux/Actions/BookingActions";
import type { RootState } from "../rootReducer";

/* ================= TYPES ================= */

interface Event {
  id: string;
  title: string;
  category: string;
  date: Date | string;
  capacity: number;
  bookedSeats: number;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  selectedDate: string;
  selectedSlot: {
    start: string;
    end: string;
    startIndex: number;
    endIndex: number;
    hours: number;
  } | null;
  foodDecoration: string;
  decorationTheme: string;
  vendors: string[];
  expectedGuests: number;
  technicalSetup: string[];
}

interface ValidationErrors {
  name?: string;
  phone?: string;
  selectedDate?: string;
  selectedSlot?: string;
  foodDecoration?: string;
  decorationTheme?: string;
}

/* ================= CONSTANTS ================= */

const FOOD_OPTIONS = [
  { label: "Veg + Basic", value: "Veg Food + Basic Decoration" },
  { label: "Non-Veg + Classic", value: "Non-Veg Food + Classic Decoration" },
  { label: "Premium Buffet", value: "Premium Buffet + Premium Decoration" },
  { label: "Birthday Theme", value: "Birthday Theme (Cake + Decoration + Food)" },
  { label: "Wedding Setup", value: "Wedding Setup (Stage + Catering + Decoration)" }
];

const DECOR_THEMES = [
  "Traditional","Luxury","Modern","Royal","Beach","Vintage"
];

const HOURLY_SLOTS = [
  "06:00 AM","07:00 AM","08:00 AM","09:00 AM","10:00 AM","11:00 AM",
  "12:00 PM","01:00 PM","02:00 PM","03:00 PM","04:00 PM",
  "05:00 PM","06:00 PM","07:00 PM","08:00 PM","09:00 PM","10:00 PM"
];

/* ================= COMPONENT ================= */

const BookingPage: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { user } = useAuth();

  if (!state) return <div>No Event Found</div>;
  const event = state as Event;

  const [step, setStep] = useState<1 | 3>(1);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [bookedDates, setBookedDates] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());
  const dispatch = useDispatch();
  const { booking, loading: bookingLoading, error } = useSelector((state: any) => state.bookings);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [open, setOpen] = useState(false);
  const [startTime, setStartTime] = useState<string | null>(null);
  const [endTime, setEndTime] = useState<string | null>(null);
const dropdownRef = useRef<HTMLDivElement>(null);
  const editData = state?.booking;
  
  const [formData, setFormData] = useState<FormData>({
    name: editData?.name || user?.displayName || "",
    email: user?.email || "",
    phone: editData?.phone || "",
    selectedDate: editData?.selectedDate
      ? new Date(editData.selectedDate).toISOString().split("T")[0]
      : "",
    selectedSlot: editData?.selectedSlot || null,
    foodDecoration: editData?.foodDecoration || "",
    decorationTheme: editData?.decorationTheme || "",
    vendors: editData?.vendors || [],
    expectedGuests: editData?.expectedGuests || 0,
    technicalSetup: editData?.technicalSetup || []
  });
  
  const [isEditMode, setIsEditMode] = useState(false);
  const [editBookingId, setEditBookingId] = useState<string | null>(null);
  

  useEffect(() => {
    if (editData?.bookingId) {
      setIsEditMode(true);
      setEditBookingId(editData.bookingId);
    }
  }, [editData]);

const handleSelect = (time: string) => {
  const startIndex = startTime ? HOURLY_SLOTS.indexOf(startTime) : -1;
  const clickedIndex = HOURLY_SLOTS.indexOf(time);

  // First click → select startTime
  if (!startTime) {
    setStartTime(time);
    setEndTime(time);
    setFormData(prev => ({
      ...prev,
      selectedSlot: {
        start: time,
        end: time,
        startIndex: clickedIndex,
        endIndex: clickedIndex + 1,
        hours: 1,
      }
    }));
    setOpen(true); // keep dropdown open for extending
    return;
  }

  // Ensure endTime is after startTime
  if (clickedIndex < startIndex) {
    alert("End time must be after start time");
    return;
  }

  // Slice range of slots
  const slotRange = HOURLY_SLOTS.slice(startIndex, clickedIndex + 1);

  // Check if any slot is booked
  const isBlocked = slotRange.some(s => bookedSlots.includes(s));
  if (isBlocked) {
    alert("Selected range includes already booked slots");
    return;
  }

  // Update endTime & formData
  setEndTime(time);
  setFormData(prev => ({
    ...prev,
    selectedSlot: {
      start: startTime,
      end: time,
      startIndex,
      endIndex: clickedIndex + 1,
      hours: clickedIndex + 1 - startIndex,
    }
  }));

  // Close dropdown automatically
  setOpen(false);

  // Clear error if any
  if (touchedFields.has("selectedSlot")) {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors.selectedSlot;
      return newErrors;
    });
  }
};


  const displayText = formData.selectedSlot
    ? `${formData.selectedSlot.start} - ${formData.selectedSlot.end}`
    : "Select Time";

  /* ================= FETCH BOOKED DATES ================= */
const availableSlots = HOURLY_SLOTS.map((time, index) => {
  const isBooked = bookedSlots.includes(time);
  const isSelected =
    formData.selectedSlot &&
    index >= formData.selectedSlot.startIndex &&
    index < formData.selectedSlot.endIndex;
  return { time, isBooked, isSelected };
});

  useEffect(() => {
    const fetchBookedDates = async () => {
      if (!event?.id) return;
      const q = query(
        collection(db, "bookings"),
        where("eventId", "==", event.id)
      );
      const snap = await getDocs(q);
      const dates: string[] = [];
      snap.forEach(d => {
        if (editData && d.id === editData.bookingId) return;
        dates.push(d.data().bookingDate.toDate().toISOString().split("T")[0]);
      });
      setBookedDates([...new Set(dates)]);
    };
    fetchBookedDates();
  }, [event?.id, editData]);

  /* ================= FETCH BOOKED SLOTS ================= */

useEffect(() => {
  const handleClickOutside = (e: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
      setOpen(false);
    }
  };
  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, []);
useEffect(() => {
  if (!formData.selectedDate || !event?.id) return;

  const fetchSlots = async () => {
    const q = query(
      collection(db, "bookings"),
      where("eventId", "==", event.id),
      where(
        "bookingDate",
        "==",
        Timestamp.fromDate(new Date(formData.selectedDate))
      )
    );
    const snap = await getDocs(q);
    const slots: string[] = [];
    snap.forEach(d => {
      if (editData && d.id === editData.bookingId) return; // skip edit booking

      const bookedSlot = d.data().timeSlot;
      // Expand bookedSlot range into individual hours
      for (let i = bookedSlot.startIndex; i < bookedSlot.endIndex; i++) {
        slots.push(HOURLY_SLOTS[i]);
      }
    });
    setBookedSlots([...new Set(slots)]); // unique slots only
  };

  fetchSlots();
}, [formData.selectedDate, event?.id, editData]);

  /* ================= VALIDATION ================= */

  const validateField = (fieldName: string, value: any): string | undefined => {
    switch (fieldName) {
      case 'name':
        if (!value || value.trim().length === 0) {
          return 'Name is required';
        }
        if (value.trim().length < 3) {
          return 'Name must be at least 3 characters';
        }
        return undefined;

      case 'phone':
        if (!value || value.trim().length === 0) {
          return 'Phone number is required';
        }
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(value.replace(/\s/g, ''))) {
          return 'Phone number must be 10 digits';
        }
        return undefined;

      case 'selectedDate':
        if (!value) {
          return 'Please select a date';
        }
        return undefined;

      case 'selectedSlot':
        if (!value) {
          return 'Please select a time slot';
        }
        return undefined;

      case 'foodDecoration':
        if (!value) {
          return 'Please select food/decoration package';
        }
        return undefined;

      case 'decorationTheme':
        if (!value) {
          return 'Please select a decoration theme';
        }
        return undefined;

      default:
        return undefined;
    }
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    const fieldsToValidate = ['name', 'phone', 'selectedDate', 'selectedSlot', 'foodDecoration', 'decorationTheme'];
    
    fieldsToValidate.forEach(field => {
      const error = validateField(field, formData[field as keyof FormData]);
      if (error) {
        newErrors[field as keyof ValidationErrors] = error;
      }
    });

    setErrors(newErrors);
    
    const hasErrors = Object.keys(newErrors).length > 0;
    
    if (hasErrors) {
      console.log("Validation errors found:", newErrors);
    }
    
    return !hasErrors;
  };

  const handleFieldChange = (fieldName: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
    
    if (touchedFields.has(fieldName)) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName as keyof ValidationErrors];
        return newErrors;
      });
    }
  };

  const handleFieldBlur = (fieldName: string) => {
    setTouchedFields(prev => new Set(prev).add(fieldName));
    const error = validateField(fieldName, formData[fieldName as keyof FormData]);
    if (error) {
      setErrors(prev => ({ ...prev, [fieldName]: error }));
    }
  };

  /* ================= CONFIRM BOOKING ================= */
  
  const confirmBooking = () => {
    if (!user) {
      alert("Login required");
      return;
    }

    // Mark all fields as touched
    setTouchedFields(new Set([
      "name",
      "phone",
      "selectedDate",
      "selectedSlot",
      "foodDecoration",
      "decorationTheme"
    ]));

    // Validate form - MUST STOP if invalid
    const isValid = validateForm();
    
    if (!isValid) {
      console.log("Validation failed - stopping execution");
      return;
    }

    // Additional check for time slot
    if (!formData.selectedSlot) {
      alert("Please select time slot");
      return;
    }

    console.log("All validations passed - proceeding with booking");

    setLoading(true);
    setHasSubmitted(true);

    const timeSlot = formData.selectedSlot;

    if (!timeSlot) {
      alert("Please select a valid time slot");
      setLoading(false);
      return;
    }

    // ✅ EDIT MODE
    if (isEditMode && editBookingId) {
      dispatch(
        updateBookingRequest({
          bookingId: editBookingId,
          eventId: event.id,
          userId: user.uid,
          name: formData.name,
          phone: formData.phone,
          foodDecoration: formData.foodDecoration,
          bookingDate: Timestamp.fromDate(new Date(formData.selectedDate)),
          timeSlot,
          decorationTheme: formData.decorationTheme
        })
      );
      return;
    }

    // ✅ CREATE MODE
    dispatch(
      createBookingRequest({
        eventId: event.id,
        eventTitle: event.title,
        userId: user.uid,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        foodDecoration: formData.foodDecoration,
        bookingDate: Timestamp.fromDate(new Date(formData.selectedDate)),
        timeSlot,
        decorationTheme: formData.decorationTheme
      })
    );
  };

  useEffect(() => {
    if (hasSubmitted && booking && !bookingLoading) {
      setLoading(false);
      setStep(3);
      setHasSubmitted(false);
    }

    if (hasSubmitted && error) {
      setLoading(false);
      alert(error);
      setHasSubmitted(false);
    }
  }, [booking, bookingLoading, error, hasSubmitted]);

  const leftVariants:Variants= {
    hidden: { opacity: 0, x: -60 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 2, ease: "easeOut" }
    }
  };

const cardVariants: Variants = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring", // ✅ type matches AnimationGeneratorType
      stiffness: 300,
      damping: 25,
      duration: 0.5, // optional
      ease: "easeInOut" // ✅ must match Easing type
    },
  },
};

  /* ================= LOADING UI ================= */

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#F5F5F5] to-[#E8F4F8]">
        <motion.div
          className="relative"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <motion.div
            className="w-32 h-32 rounded-full border-4 border-[#65C9DA]/20"
            animate={{ rotate: 360 }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "linear",
            }}
          />

          <motion.div
            className="absolute inset-0 m-auto w-24 h-24 rounded-full bg-gradient-to-br from-[#65C9DA] to-[#1FA8B8]"
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          <motion.div
            className="absolute inset-0 m-auto w-12 h-12 flex items-center justify-center"
            animate={{ rotate: 360 }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <Sparkles className="w-8 h-8 text-white" />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="mt-8 text-center"
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            Processing Your Booking
          </h3>
          <p className="text-gray-600">
            Please wait while we confirm your reservation...
          </p>
        </motion.div>

        <div className="flex gap-3 mt-6">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-3 h-3 rounded-full bg-[#65C9DA]"
              animate={{
                y: [0, -12, 0],
                opacity: [0.4, 1, 0.4],
              }}
              transition={{
                duration: 1.6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.3,
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  /* ================= MAIN UI ================= */

  return (
    <>
      <div
        className="min-h-screen flex relative"
        style={{
          backgroundImage: `url(${eventimage})`,
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        <div className="absolute inset-0 bg-black/50" />

        <div className="relative z-10 flex w-full h-full">
          <motion.div
            variants={leftVariants}
            initial="hidden"
            animate="visible"
            className="hidden lg:flex flex-col justify-center flex-1 px-16 text-white relative z-10"
          >
            <h2 className="text-4xl font-bold mb-4 leading-tight">
              Make Your Event <br />
              <span className="text-[#65C9DA]">Unforgettable</span>
            </h2>

            <p className="text-white/80 mb-6 max-w-md">
              Book premium event planning with customized themes,
              professional setup and seamless execution.
            </p>

            <ul className="space-y-3 text-sm">
              {[
                "Premium Decoration Themes",
                "Hygienic Catering Options",
                "On-Time Setup & Support",
                "Trusted by 500+ Clients"
              ].map((text, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.15 }}
                  className="flex items-center gap-2"
                >
                  ✔ {text}
                </motion.li>
              ))}
            </ul>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="mt-8 text-xs text-white/60"
            >
              📞 24/7 Support • Secure Booking • Easy Cancellation
            </motion.div>
          </motion.div>

          <div className="flex-1" />

          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="relative w-full max-w-xl m-6 mt-4 rounded-xl shadow-2xl overflow-visible
                       bg-white/60 backdrop-blur-md border border-white/20"
          >
            <div className="relative overflow-hidden rounded-t-xl bg-gradient-to-r from-[#1FA8B8] to-[#65C9DA] p-2 text-white">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full" />
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full" />
              <div className="rounded-t-xl bg-[#65C9DA]/90 backdrop-blur-md p-6 text-white shadow-lg 
                              flex flex-col items-center justify-center text-center">
                <h1 className="text-2xl font-semibold">
                  {editData?.title || event.title}
                </h1>
                <p className="text-xs mt-1 text-white/80">
                  Secure booking • Real-time slots
                </p>
              </div>
            </div>

            <div className="p-5">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-1 block">
                          Full Name
                        </label>
                        <input
                          placeholder="Name"
                          value={formData.name}
                          onChange={e => handleFieldChange('name', e.target.value)}
                          onBlur={() => handleFieldBlur('name')}
                          className={`border p-2 rounded-lg w-full transition-colors ${
                            errors.name && touchedFields.has('name')
                              ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                              : 'border-gray-300 focus:border-[#65C9DA] focus:ring-[#65C9DA]/20'
                          } focus:outline-none focus:ring-2`}
                        />
                        <AnimatePresence>
                          {errors.name && touchedFields.has('name') && (
                            <motion.p
                              initial={{ opacity: 0, y: -10, height: 0 }}
                              animate={{ opacity: 1, y: 0, height: 'auto' }}
                              exit={{ opacity: 0, y: -10, height: 0 }}
                              className="text-red-500 text-xs mt-1 flex items-center gap-1"
                            >
                              {errors.name}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-1 block">
                          Phone Number
                        </label>
                        <input
                          placeholder="Phone"
                          value={formData.phone}
                          onChange={e => handleFieldChange('phone', e.target.value)}
                          onBlur={() => handleFieldBlur('phone')}
                          className={`border p-2 rounded-lg w-full transition-colors ${
                            errors.phone && touchedFields.has('phone')
                              ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                              : 'border-gray-300 focus:border-[#65C9DA] focus:ring-[#65C9DA]/20'
                          } focus:outline-none focus:ring-2`}
                        />
                        <AnimatePresence>
                          {errors.phone && touchedFields.has('phone') && (
                            <motion.p
                              initial={{ opacity: 0, y: -10, height: 0 }}
                              animate={{ opacity: 1, y: 0, height: 'auto' }}
                              exit={{ opacity: 0, y: -10, height: 0 }}
                              className="text-red-500 text-xs mt-1 flex items-center gap-1"
                            >
                              {errors.phone}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-1 flex items-center gap-1">
                          <Mail size={14} className="text-gray-500" />
                          Email
                        </label>
                        <input
                          value={formData.email}
                          disabled
                          className="w-full border px-3 py-2 rounded-lg border-gray-300 bg-gray-50 cursor-not-allowed focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-1 block">
                          Arrangements
                        </label>
                        <select
                          value={formData.foodDecoration}
                          onChange={e => handleFieldChange('foodDecoration', e.target.value)}
                          onBlur={() => handleFieldBlur('foodDecoration')}
                          className={`border p-2 rounded-lg w-full transition-colors ${
                            errors.foodDecoration && touchedFields.has('foodDecoration')
                              ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                              : 'border-gray-300 focus:border-[#65C9DA] focus:ring-[#65C9DA]/20'
                          } focus:outline-none focus:ring-2`}
                        >
                          <option value="">Select Food / Decoration</option>
                          {FOOD_OPTIONS.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        <AnimatePresence>
                          {errors.foodDecoration && touchedFields.has('foodDecoration') && (
                            <motion.p
                              initial={{ opacity: 0, y: -10, height: 0 }}
                              animate={{ opacity: 1, y: 0, height: 'auto' }}
                              exit={{ opacity: 0, y: -10, height: 0 }}
                              className="text-red-500 text-xs mt-1 flex items-center gap-1"
                            >
                              {errors.foodDecoration}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="text-sm font-medium flex items-center gap-1 mb-1">
                          <Calendar size={14} className="text-gray-500" />
                          <span>Date</span>
                        </label>
                        <input
                          type="date"
                          value={formData.selectedDate}
                          min={new Date().toISOString().split("T")[0]}
                          onChange={e => {
                            handleFieldChange('selectedDate', e.target.value);
                            setFormData(p => ({ ...p, selectedSlot: null }));
                            setStartTime(null);
                            setEndTime(null);
                          }}
                          onBlur={() => handleFieldBlur('selectedDate')}
                          className={`border p-2 rounded-lg w-full transition-colors ${
                            errors.selectedDate && touchedFields.has('selectedDate')
                              ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                              : 'border-gray-300 focus:border-[#65C9DA] focus:ring-[#65C9DA]/20'
                          } focus:outline-none focus:ring-2`}
                        />
                        <AnimatePresence>
                          {errors.selectedDate && touchedFields.has('selectedDate') && (
                            <motion.p
                              initial={{ opacity: 0, y: -10, height: 0 }}
                              animate={{ opacity: 1, y: 0, height: 'auto' }}
                              exit={{ opacity: 0, y: -10, height: 0 }}
                              className="text-red-500 text-xs mt-1 flex items-center gap-1"
                            >
                              {errors.selectedDate}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-1 block">
                          Decoration Theme
                        </label>
                        <select
                          value={formData.decorationTheme}
                          onChange={e => handleFieldChange('decorationTheme', e.target.value)}
                          onBlur={() => handleFieldBlur('decorationTheme')}
                          className={`border p-2 rounded-lg w-full transition-colors ${
                            errors.decorationTheme && touchedFields.has('decorationTheme')
                              ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                              : 'border-gray-300 focus:border-[#65C9DA] focus:ring-[#65C9DA]/20'
                          } focus:outline-none focus:ring-2`}
                        >
                          <option value="">Select</option>
                          {DECOR_THEMES.map(d => (
                            <option key={d}>{d}</option>
                          ))}
                        </select>
                        <AnimatePresence>
                          {errors.decorationTheme && touchedFields.has('decorationTheme') && (
                            <motion.p
                              initial={{ opacity: 0, y: -10, height: 0 }}
                              animate={{ opacity: 1, y: 0, height: 'auto' }}
                              exit={{ opacity: 0, y: -10, height: 0 }}
                              className="text-red-500 text-xs mt-1 flex items-center gap-1"
                            >
                              {errors.decorationTheme}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>

                    <div ref={dropdownRef} className="relative w-full">
  <div
    onClick={() => formData.selectedDate && setOpen(!open)}
    className={`border p-2 rounded-lg bg-white cursor-pointer transition-colors ${
      !formData.selectedDate ? "bg-gray-100 cursor-not-allowed" : ""
    }`}
  >
    {formData.selectedSlot
      ? `${formData.selectedSlot.start} - ${formData.selectedSlot.end}`
      : "Select Time"}
  </div>

  {open && formData.selectedDate && (
    <div className="absolute mt-2 w-full max-h-60 overflow-y-auto bg-white border rounded-lg shadow-lg z-50">
  {availableSlots
  .filter(slot => !slot.isBooked) // only show available slots
  .map(slot => (
    <div
      key={slot.time}
      onClick={() => handleSelect(slot.time)}
      className={`px-3 py-2 text-sm cursor-pointer 
        ${slot.isSelected ? "bg-[#65C9DA] text-white" : "hover:bg-gray-100"}
      `}
    >
      {slot.time}
    </div>
))}

    </div>
  )}
</div>

                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center max-w-md mx-auto"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                      className="relative inline-block"
                    >
                      <motion.div
                        className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center mx-auto mb-6"
                        animate={{
                          boxShadow: [
                            "0 0 0 0 rgba(74, 222, 128, 0.4)",
                            "0 0 0 20px rgba(74, 222, 128, 0)",
                          ],
                        }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <CheckCircle2 className="w-16 h-16 text-white" strokeWidth={3} />
                      </motion.div>
                    </motion.div>

                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                      Booking Confirmed! 🎉
                    </h2>

                    <p className="text-gray-600 mb-1 text-sm">
                      Your event has been successfully booked
                    </p>

                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="text-sm text-gray-500"
                    >
                      Confirmation sent to <strong>{formData.email}</strong>
                    </motion.p>

                   <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.7 }}
  className="mt-4 bg-gradient-to-br from-[#65C9DA]/40 to-[#1FA8B8]/40 rounded-2xl p-6 text-left text-sm shadow-lg border border-white/20 backdrop-blur-sm"
>
  <div className="flex justify-between mb-2">
    <span className="text-gray-800 font-medium">Event:</span>
    <span className="font-semibold">{editData?.title || event.title}</span>
  </div>

  <div className="space-y-3 text-sm">
    <div className="flex justify-between">
      <span className="text-gray-800">Date:</span>
      <span className="font-semibold">{formData.selectedDate}</span>
    </div>
    <div className="flex justify-between">
      <span className="text-gray-800">Time:</span>
      <span className="font-medium">
                            {formData.selectedSlot?.start} - {formData.selectedSlot?.end}
                          </span>
    </div>
    <div className="flex justify-between">
      <span className="text-gray-800">Theme:</span>
      <span className="font-semibold">{formData.decorationTheme}</span>
    </div>
  </div>
</motion.div>


                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                      className="mt-8 flex justify-center gap-4"
                    >
                      <button
                        onClick={() => navigate("/my-bookings")}
                        className="px-6 py-2.5 rounded-lg text-white text-sm font-medium 
                                   bg-gradient-to-r from-[#1FA8B8] to-[#75C9DA] 
                                   hover:from-[#75C9DA] hover:to-[#1FA8B8] transition-all"
                      >
                        Go to My Events
                      </button>

                      <button
                        onClick={() => navigate("/")}
                        className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 text-sm 
                                   hover:bg-gray-100 transition"
                      >
                        Back to Home
                      </button>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {step === 1 && (
              <div className="p-5 border-t flex justify-between items-center">
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <Lock size={12} /> Secure booking
                </span>
                <button
                  onClick={confirmBooking}
                  disabled={loading}
                  className="bg-[#65C9DA] px-5 py-2 rounded-lg text-white text-sm hover:bg-[#55B8C9] transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading
                    ? "Processing..."
                    : isEditMode
                    ? "Update Booking"
                    : "Confirm Booking"}
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default BookingPage;