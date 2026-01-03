import { AUTH_LOADING, CLEAR_USER, SET_USER } from '../Actions/AuthAction';
import * as types from '../Types/AuthType';

export interface AuthState {
  user: any | null;
  loading: boolean;
  error: string | null;
}

// const initialState: AuthState = {
//   user: null,
//   loading: false,
//   error: null,
// };

const initialState = {
  user: null,
  loading: true, // ✅ Start with true
  error: null
};

export const authReducer = (state = initialState, action: any)=> {
  switch (action.type) {
    case types.SIGN_UP_REQUEST:
    case types.SIGN_IN_REQUEST:
      return { ...state, loading: true, error: null };

    case types.SIGN_UP_SUCCESS:
    case types.SIGN_IN_SUCCESS:
    case types.SET_USER:
      return { ...state, loading: false, user: action.payload };

    case types.SIGN_UP_FAILURE:
    case types.SIGN_IN_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case types.LOGOUT:
      return { ...state, user: null };



// export const authReducer = (state = initialState, action: any) => {
//   switch (action.type) {
    case SET_USER:
      console.log("✅ AUTH REDUCER: Setting user", action.payload);
      return {
        ...state,
        user: action.payload,
        loading: false,
        error: null
      };
    
    case CLEAR_USER:
      console.log("❌ AUTH REDUCER: Clearing user");
      return {
        ...state,
        user: null,
        loading: false,
        error: null
      };
    
    case AUTH_LOADING:
      return {
        ...state,
        loading: action.payload
      };


    case types.LOGOUT_REQUEST:
      return { ...state, loading: true };

    case types.LOGOUT_SUCCESS:
      return {
        ...state,
        user: null,
        loading: false,
        error: null
      };
       case "LOGOUT_SUCCESS":
      return initialState;

    case types.LOGOUT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };


    default:
      return state;
  }
}
