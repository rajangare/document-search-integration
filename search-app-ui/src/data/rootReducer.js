import { combineReducers } from "redux";
import { searchPageReducer } from "./searching";

export default combineReducers({
    search: searchPageReducer
})