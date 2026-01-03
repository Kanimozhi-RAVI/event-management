import { all, fork } from 'redux-saga/effects';
import authSaga from './Redux/Saga/AuthSaga';
import bookingSaga from './Redux/Saga/BookingSaga';

export default function* rootSaga() {
  yield all([
    fork(authSaga),
    fork(bookingSaga),
  ]);
}
