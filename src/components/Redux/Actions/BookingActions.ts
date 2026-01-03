import { SET_CURRENT_BOOKING } from '../Reducer/bookingReducer';
import * as types from '../Types/BookingTypes';

export const getUserBookingsRequest = (uid: string) => ({
  type: types.GET_USER_BOOKINGS_REQUEST,
  payload: uid,
});

export const getUserBookingsSuccess = (bookings: any[]) => ({
  type: types.GET_USER_BOOKINGS_SUCCESS,
  payload: bookings,
});

export const getUserBookingsFailure = (error: string) => ({
  type: types.GET_USER_BOOKINGS_FAILURE,
  payload: error,
});

export const cancelBookingRequest = (bookingId: string) => ({
  type: types.CANCEL_BOOKING_REQUEST,
  payload: bookingId,
});

export const cancelBookingSuccess = (bookingId: string) => ({
  type: types.CANCEL_BOOKING_SUCCESS,
  payload: bookingId,
});

export const cancelBookingFailure = (error: string) => ({
  type: types.CANCEL_BOOKING_FAILURE,
  payload: error,
});



export const createBookingRequest = (data: any) => ({
  type: types.CREATE_BOOKING_REQUEST,
  payload: data,
});

export const createBookingSuccess = (booking: any) => ({
  type: types.CREATE_BOOKING_SUCCESS,
  payload: booking,
});

export const createBookingFailure = (error: string) => ({
  type: types.CREATE_BOOKING_FAILURE,
  payload: error,
});

export const setCurrentBooking = (booking: any) => ({
  type: SET_CURRENT_BOOKING,
  payload: booking
});
// bookingActions.ts

// BookingActions.ts
export const UPDATE_BOOKING_REQUEST = 'UPDATE_BOOKING_REQUEST';
export const UPDATE_BOOKING_SUCCESS = 'UPDATE_BOOKING_SUCCESS';
export const UPDATE_BOOKING_FAILURE = 'UPDATE_BOOKING_FAILURE';

export const updateBookingRequest = (bookingData: any) => ({
  type: UPDATE_BOOKING_REQUEST,
  payload: bookingData
});

export const updateBookingSuccess = (booking: any) => ({
  type: UPDATE_BOOKING_SUCCESS,
  payload: booking
});

export const updateBookingFailure = (error: string) => ({
  type: UPDATE_BOOKING_FAILURE,
  payload: error
});
