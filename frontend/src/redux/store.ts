import { configureStore } from "@reduxjs/toolkit";
import { thunk } from "redux-thunk";
import weatherReducer from "../components/header/Header.duck";
import userSlice from "./user/user.slice";
import loginPageReducer from "../pages/login/LoginPage.duck";

export const store = configureStore({
    reducer: {
        weather: weatherReducer,
        loginPage: loginPageReducer,
        user: userSlice.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch