import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from '../Types/AuthType';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import {  doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { signUpSuccess, signUpFailure, signInSuccess, signInFailure, logoutSuccess, logoutFailure } from '../Actions/AuthAction';
import { logoutUser } from '@/lib/firestoreOperations';
import { auth, db } from '@/lib/firebase';

function* signUpSaga(action: any): Generator<any, void, any> {
  const { email, password, displayName } = action.payload;
  try {
    // 1️⃣ Create user in Firebase Auth
    const userCredential = yield call(createUserWithEmailAndPassword, auth, email, password);
    const firebaseUser = userCredential.user;

    // 2️⃣ Update displayName
    yield call(updateProfile, firebaseUser, { displayName });

    // 3️⃣ Store user in Firestore
    const userRef = doc(db, "users", firebaseUser.uid);
    yield call(() =>
      setDoc(userRef, {
        uid: firebaseUser.uid,
        email,
        displayName,
        photoURL: "",
        createdAt: serverTimestamp(),
      })
    );

    // 4️⃣ 🔥 Force logout immediately
    yield call(() => auth.signOut());

    // 5️⃣ Dispatch success (no user in state)
    yield put(signUpSuccess());

  } catch (error: any) {
    yield put(signUpFailure(error.message));
  }
}

function* signInSaga(action: any): Generator<any, void, any>{
  const { email, password } = action.payload;
  try {
    const userCredential = yield call(
      signInWithEmailAndPassword,
      auth,
      email,
      password
    );

    const firebaseUser = userCredential.user;
    const userDoc = yield call(
      getDoc,
      doc(db, "users", firebaseUser.uid)
    );

    yield put(
      signInSuccess({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName:
          firebaseUser.displayName || userDoc.data()?.displayName,
        photoURL:
          firebaseUser.photoURL || userDoc.data()?.photoURL,

        // ✅ SERIALIZABLE
        createdAt: userDoc.data()?.createdAt
          ? userDoc.data().createdAt.toMillis()
          :  Date.now(),

      })
    );
// This should have user data
  } catch (error: any) {
    yield put(signInFailure(error.message));
  }
}

export function* logoutSaga() {
  try {
    yield call(logoutUser); // 🔓 Firebase signOut
    yield put(logoutSuccess()); // ✅ Redux clear
  } catch (error: any) {
    yield put(logoutFailure(error.message));
  }
}


export default function* authSaga() {
  yield takeLatest(types.SIGN_UP_REQUEST, signUpSaga);
  yield takeLatest(types.SIGN_IN_REQUEST, signInSaga);
  yield takeLatest(types.LOGOUT_REQUEST, logoutSaga);

}
