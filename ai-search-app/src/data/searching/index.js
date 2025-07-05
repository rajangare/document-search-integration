import modalSlice from './slice';
import { watcher } from './saga';

export const {
    actions: searchPageActions,
    reducer: searchPageReducer
} = modalSlice;

export {watcher}