import { combineReducers } from 'redux';
import { authReducer } from './Redux/Reducer/AuthReducer';
import { bookingReducer } from './Redux/Reducer/bookingReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  bookings: bookingReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
