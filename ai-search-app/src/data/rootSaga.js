import { fork, all } from "redux-saga/effects";
import { watcher as searchWatcher} from './searching'

export default function * () {
    yield all ([
        fork(searchWatcher)
    ])
}