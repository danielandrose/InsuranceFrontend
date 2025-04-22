import {createSlice} from "@reduxjs/toolkit";

const policySlice=createSlice({
    name:"policy",
    initialState:[],
    reducers:{
        addPolicy(state,action){
            state.push(action.payload);
        },
        deletePolicy(state,action){
            const deleteIndex=action.payload;
            return state.filter((val,ind)=>ind!==deleteIndex)
        }
    }
})

export const {addPolicy,deletePolicy} = policySlice.actions

export default policySlice.reducer