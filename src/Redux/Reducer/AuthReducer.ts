import * as types from "../Types/AuthType";

const initialState = {
  user: null,
  loading: true, // 🔥 wait for firebase auth
  error: null,
};

export const authReducer = (state = initialState, action: any) => {
  switch (action.type) {

    // 🔄 Requests
    case types.SIGN_IN_REQUEST:
    case types.SIGN_UP_REQUEST:
    case types.LOGOUT_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    // ✅ Login / Signup / Firebase auth success
    case types.SIGN_IN_SUCCESS:
    case types.SIGN_UP_SUCCESS:
    case types.SET_USER:
      return {
        ...state,
        user: action.payload,
        loading: false,
        error: null,
      };

    // 🚪 Logout success
    case types.LOGOUT_SUCCESS:
      return {
        ...state,
        user: null,
        loading: false,
        error: null,
      };

    // ❌ Errors
    case types.SIGN_IN_FAILURE:
    case types.SIGN_UP_FAILURE:
    case types.LOGOUT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};
