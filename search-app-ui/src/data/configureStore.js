import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import rootReducer from "./rootReducer";
import rootSaga from "./rootSaga";
import logger from "redux-logger";

export function initiateStore () {
    const sagaMiddleware = createSagaMiddleware();
    const middleWares = [sagaMiddleware]
    if( process.env.NODE_ENV === 'development'){
        middleWares.push(logger);
    }
    const configStore = configureStore({
        reducer: rootReducer,
        middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(middleWares)
    });
    sagaMiddleware.run(rootSaga);
    return configStore;
}

export const store = initiateStore();