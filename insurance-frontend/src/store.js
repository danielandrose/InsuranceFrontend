import { configureStore } from '@reduxjs/toolkit';
import policyReducer from "./slices/policySlice.js"

export const store=configureStore({
    devTools:true,
    reducer:{   
        policy:policyReducer
    }
})