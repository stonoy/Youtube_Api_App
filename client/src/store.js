import { configureStore } from "@reduxjs/toolkit";
import youtubeReducer from "./feature/youtubeSlice"

export const store = configureStore({
    reducer : {
        youtube: youtubeReducer,
    }
})