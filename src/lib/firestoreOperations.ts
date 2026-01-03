import { collection, doc, getDocs, query, where, orderBy, updateDoc, Timestamp, addDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { useEffect } from 'react';
import { signOut } from 'firebase/auth';

export interface BookingData {
  userId: string;
  bookingDate: Date | any;
  timeSlot: string;
  status?: string;
  [key: string]: any;
}
export interface Booking {
  id: string;
  userId: string;
  bookingDate: Date | any;
  status?: string;
  [key: string]: any;
}

export interface BookingResponse {
  success: boolean;
  booking?: BookingData & { id: string };
  bookings?: BookingData[];
  error?: string;
}

// Fetch all bookings of a user
// BookingActions.ts or wherever your API call is
export const getUserBookings = async (userId: string) => {
  console.log("📞 Fetching bookings for", userId);
  
  try {
    const bookingsRef = collection(db, 'bookings');
    const q = query(bookingsRef, where('userId', '==', userId));
    
    const snapshot = await getDocs(q);
    console.log("📦 Snapshot size:", snapshot.size);
    
const bookings =snapshot.docs.map(doc => {
  const data = doc.data();
  return {
    id: doc.id,
    ...data,
    bookingDate: data.bookingDate?.toDate?.()
      ? data.bookingDate.toDate().toISOString()
      : data.bookingDate instanceof Date
      ? data.bookingDate.toISOString()
      : data.bookingDate
  };
});


    
    console.log("📦 Fetched bookings:", bookings);
    
    return {
      success: true,
      bookings // ✅ Plural - always an array
    };
  } catch (error) {
    console.error("❌ Fetch error:", error);
    return {
      success: false,
      error: error.message,
      bookings: [] // ✅ Empty array on error
    };
  }
};


export const cancelBooking = async (bookingId: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const bookingRef = doc(db, 'bookings', bookingId);
    await updateDoc(bookingRef, { status: 'cancelled' });
    return { success: true };
  } catch (err: any) {
    console.error('cancelUserBooking error:', err);
    return { success: false, error: err.message };
  }
};


export const createBooking = async (data: BookingData): Promise<BookingResponse> =>{
  try {
    const bookingData = {
      ...data,
      bookingDate:
        data.bookingDate instanceof Date
          ? Timestamp.fromDate(data.bookingDate)
          : data.bookingDate,
      createdAt: Timestamp.now(),
        timeSlot: data.timeSlot,
      
    };

    const docRef = await addDoc(
      collection(db, "bookings"),
      bookingData
    );

    // 🔥 VERY IMPORTANT RETURN
    return {
      success: true,
      booking: {
        id: docRef.id,
        ...bookingData,
      },
    };
  } catch (error: any) {
    console.error("🔥 Firestore createBooking error", error);
    return {
      success: false,
      error: error.message,
    };
  }
};
export const updateBooking = async (bookingId: string, updatedData: Partial<BookingData>): Promise<{ success: boolean; error?: string }> => {
  try {
    const bookingRef = doc(db, "bookings", bookingId);

    // 🚀 REMOVE undefined fields
    const cleanData = Object.fromEntries(
      Object.entries(updatedData).filter(
        ([_, value]) => value !== undefined
      )
    );

    const dataToUpdate = {
      ...cleanData,
      updatedAt: Timestamp.now(),
    };

    await updateDoc(bookingRef, dataToUpdate);

    return { success: true };
  } catch (error: any) {
    console.error("🔥 updateBooking error", error);
    return { success: false, error: error.message };
  }
};
export const logoutUser = async () => {
  await signOut(auth);
};


