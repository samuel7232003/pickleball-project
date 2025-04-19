import { configureStore } from "@reduxjs/toolkit";
import { thunk } from "redux-thunk";
import weatherReducer from "../components/header/Header.duck";

export const store = configureStore({
    reducer: {
        weather: weatherReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch