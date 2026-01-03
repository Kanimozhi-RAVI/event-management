import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from '../Types/BookingTypes';
import { getUserBookings, cancelBooking, createBooking, updateBooking } from '../../lib/firestoreOperations';
import {
  getUserBookingsSuccess,
  getUserBookingsFailure,
  cancelBookingSuccess,
  cancelBookingFailure,
  createBookingSuccess,
  createBookingFailure,
  getUserBookingsRequest,
  UPDATE_BOOKING_REQUEST,
  updateBookingSuccess,
  updateBookingFailure,
} from '../Actions/BookingActions';
import { toast } from '@/hooks/use-toast';


function* fetchUserBookings(action: any): Generator<any, void, any> {
  console.log("🔥 booking saga called", action.payload);

  try {
    const result = yield call(getUserBookings, action.payload);
    console.log("🔥 Firestore result", result);

    if (result.success) {
      const bookings = Array.isArray(result.bookings) 
        ? result.bookings 
        : result.booking 
          ? [result.booking]
          : [];
      
      yield put(getUserBookingsSuccess(bookings));
    } else {
      yield put(getUserBookingsFailure(result.error));
    }
  } catch (error: any) {
    yield put(getUserBookingsFailure(error.message));
  }
}
function* cancelBookingSaga(action: any): any {
  try {
    const bookingId = action.payload;
    const response = yield call(cancelBooking, bookingId);

    if (response.success) {
      yield put(cancelBookingSuccess(bookingId)); // 🔥 VERY IMPORTANT
    } else {
      yield put(cancelBookingFailure(response.error));
    }
  } catch (error: any) {
    yield put(cancelBookingFailure(error.message));
  }
}

function* createBookingSaga(action: any): Generator<any, void, any> {
  try {
    const result = yield call(createBooking, action.payload);
    
    if (result.success) {
      yield put(createBookingSuccess(result.booking));
      
      // ✅ Fetch updated bookings list
      yield put(getUserBookingsRequest(action.payload.userId));
      
      toast({
        title: "Booking Created!",
        description: "Your booking has been confirmed"
      });
    }
  } catch (error: any) {
    yield put(createBookingFailure(error.message));
  }
}

// ✅ FIXED: Get full booking data after update
function* updateBookingSaga(action: any): any {
  console.log("📝 Update saga called", action.payload);

  try {
    const { bookingId, userId, ...updateData } = action.payload;

    // 🔥 Call Firestore update correctly
    const result = yield call(updateBooking, bookingId, updateData);

    if (!result.success) {
      throw new Error(result.error || "Update failed");
    }

    // ✅ Build full updated booking object
    const updatedBooking = {
      id: bookingId,
      userId,
      ...updateData,
    };

    // ✅ Update Redux store
    yield put(updateBookingSuccess(updatedBooking));

    // ✅ Toast success
    toast({
      title: "Booking Updated!",
      description: "Your booking has been updated successfully",
    });

    // ✅ Refresh bookings list (recommended)
    if (userId) {
      yield put(getUserBookingsRequest(userId));
    }

  } catch (error: any) {
    console.error("❌ Update error:", error);

    yield put(updateBookingFailure(error.message));

    toast({
      title: "Update Failed",
      description: error.message,
      variant: "destructive",
    });
  }
}


export default function* bookingSaga() {
  console.log("🔥 bookingSaga REGISTERED");

  yield takeLatest(types.CREATE_BOOKING_REQUEST, createBookingSaga);
  yield takeLatest(types.GET_USER_BOOKINGS_REQUEST, fetchUserBookings);
  yield takeLatest(types.CANCEL_BOOKING_REQUEST, cancelBookingSaga);
  yield takeLatest(UPDATE_BOOKING_REQUEST, updateBookingSaga);
}