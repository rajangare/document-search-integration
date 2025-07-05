import { takeEvery, takeLatest, put, call } from 'redux-saga/effects';
import { searchPageActions } from '.'; 
import { getAccessGroup } from '../../util/httpservices';

function* handleModalOpen() {
  console.log('Modal opened');

}

export function * getAccess() {
  try {
    const response = yield call(getAccessGroup);
    // If response is { access_groups: [...] }, extract the array
    const accessList = Array.isArray(response) ? response : response?.access_groups || [];
    yield put(searchPageActions.getAccessSuccess(accessList));
  } catch (e) {
    console.log ('Error occured while fetching'); 
    yield put(searchPageActions.getAccessFailed());
  }
}


export function* watcher() {
  yield takeEvery(searchPageActions.openModal.type, handleModalOpen);
  yield takeLatest(searchPageActions.getAccess.type, getAccess);
}

