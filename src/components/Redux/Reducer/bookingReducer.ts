import { UPDATE_BOOKING_FAILURE, UPDATE_BOOKING_REQUEST, UPDATE_BOOKING_SUCCESS } from '../Actions/BookingActions';
import * as types from '../Types/BookingTypes';

interface BookingState {
  bookings: any[];
  loading: boolean;
  error: string | null;
}

const initialState: BookingState = {
  bookings: [],
  loading: false,
  error: null,
};
  export const SET_CURRENT_BOOKING = 'SET_CURRENT_BOOKING';


// // export const bookingReducer = (state = initialState, action: any): BookingState => {
//   switch (action.type) {
//     case types.GET_USER_BOOKINGS_REQUEST:
//     case types.CANCEL_BOOKING_REQUEST:
//       return { ...state, loading: true, error: null };


export const bookingReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case types.CANCEL_BOOKING_REQUEST:
      return { ...state, loading: true, error: null };

    case 'GET_USER_BOOKINGS_REQUEST':
      return {
        ...state,
        loading: true,
        error: null
      };
    
    case 'GET_USER_BOOKINGS_SUCCESS':
      console.log("✅ Reducer received bookings:", action.payload);
      return {
        ...state,
        loading: false,
        bookings: action.payload, // ⚠️ Inga payload correct ah set aguthaa?
        error: null
      };
      
    
    case 'GET_USER_BOOKINGS_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    

    case types.CANCEL_BOOKING_SUCCESS:
      return {
        ...state,
        loading: false,
        bookings: state.bookings.map(b =>
          b.id === action.payload ? { ...b, status: 'cancelled' } : b
        ),
      };

    case types.GET_USER_BOOKINGS_FAILURE:
    case types.CANCEL_BOOKING_FAILURE:
      return { ...state, loading: false, error: action.payload };
 
  case types.CREATE_BOOKING_REQUEST:
  return {
    ...state,
    loading: true,
    error: null,
  };

case types.CREATE_BOOKING_SUCCESS:
  return {
    ...state,
    loading: false,
    booking: action.payload,
  };

case types.CREATE_BOOKING_FAILURE:
  return {
    ...state,
    loading: false,
    error: action.payload,
  };




// bookingReducer.ts
case SET_CURRENT_BOOKING:
  return {
    ...state,
    currentBooking: action.payload
  };


  // bookingReducer.ts
case UPDATE_BOOKING_REQUEST:
  return {
    ...state,
    loading: true,
    error: null
  };

case UPDATE_BOOKING_SUCCESS:
  return {
    ...state,
    loading: false,
    bookings: state.bookings.map(b => 
      b.id === action.payload.id ? { ...b, ...action.payload } : b
    ),
    booking: action.payload,
    error: null
  };

case UPDATE_BOOKING_FAILURE:
  return {
    ...state,
    loading: false,
    error: action.payload
  };
    default:
      return state;
  }
};
