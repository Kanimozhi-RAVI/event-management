import * as types from '../Types/AuthType';

export const signUpRequest = (email: string, password: string, displayName: string) => ({
  type: types.SIGN_UP_REQUEST,
  payload: { email, password, displayName },
});

export const signUpSuccess = () => ({
  type: types.SIGN_UP_SUCCESS,
});


export const signUpFailure = (error: string) => ({
  type: types.SIGN_UP_FAILURE,
  payload: error,
});

export const signInRequest = (email: string, password: string) => ({
  type: types.SIGN_IN_REQUEST,
  payload: { email, password },
});

export const signInSuccess = (user: any) => ({
  type: types.SIGN_IN_SUCCESS,
  payload: user,
});

export const signInFailure = (error: string) => ({
  type: types.SIGN_IN_FAILURE,
  payload: error,
});


// Redux/Actions/AuthActions.ts
export const SET_USER = 'SET_USER';
export const CLEAR_USER = 'CLEAR_USER';
export const AUTH_LOADING = 'AUTH_LOADING';

export const setUser = (user: any) => ({
  type: SET_USER,
  payload: user
});

export const clearUser = () => ({
  type: CLEAR_USER
});

export const setAuthLoading = (loading: boolean) => ({
  type: AUTH_LOADING,
  payload: loading
});
export const logout = () => ({ type: types.LOGOUT });



export const logoutRequest = () => ({
  type: types.LOGOUT_REQUEST
});

export const logoutSuccess = () => ({
  type: types.LOGOUT_SUCCESS
});

export const logoutFailure = (error: string) => ({
  type: types.LOGOUT_FAILURE,
  payload: error
});

// export const setUser = (user: any) => ({ type: types.SET_USER, payload: user });
