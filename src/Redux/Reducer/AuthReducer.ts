import * as types from "../Types/AuthType";

const initialState = {
  user: null,
  loading: false,
  error: null,
  isRegistered: false, // ✅ Add this flag
};

export const authReducer = (state = initialState, action: any) => {
  switch (action.type) {


       case types.RESET_REGISTRATION_STATE:
      return {
        ...state,
        isRegistered: false,
        error: null,
      };
    // 🔄 Sign Up Request
    case types.SIGN_UP_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        isRegistered: false, // ✅ Reset
      };

    // ✅ Sign Up Success (NO user, just flag)
    case types.SIGN_UP_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        isRegistered: true, // ✅ Set true (account created, but logged out)
        user: null, // ✅ Important: No user here (firebase signed out)
      };

    // 🔄 Sign In Request
    case types.SIGN_IN_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        isRegistered: false, // ✅ Reset on login
      };

    // ✅ Sign In Success (WITH user data)
    case types.SIGN_IN_SUCCESS:
    case types.SET_USER:
      return {
        ...state,
        user: action.payload,
        loading: false,
        error: null,
        isRegistered: false, // ✅ Reset
      };

    // 🔄 Logout Request
    case types.LOGOUT_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    // 🚪 Logout Success
    case types.LOGOUT_SUCCESS:
    case types.CLEAR_USER:
      return {
        ...state,
        user: null,
        loading: false,
        error: null,
        isRegistered: false,
      };

    // ❌ Errors
    case types.SIGN_IN_FAILURE:
    case types.SIGN_UP_FAILURE:
    case types.LOGOUT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        isRegistered: false, // ✅ Reset on error
      };

    // 🔄 Auth Loading
    case types.AUTH_LOADING:
      return {
        ...state,
        loading: action.payload,
      };

    default:
      return state;
  }
};