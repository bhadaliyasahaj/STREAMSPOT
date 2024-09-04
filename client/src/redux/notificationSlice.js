import { createSlice } from "@reduxjs/toolkit";

const initialState ={
    message:"",
    visible:false
};

export const notificationSlice = createSlice({
    name:"notification",
    initialState,
    reducers:{
        setmessage : (state,action)=>{
            state.message = action.payload
            state.visible = true
        },
        invisible:(state)=>{
            state.visible = false
            state.message = ""
        }
    }
})

export const {setmessage,invisible} = notificationSlice.actions;

export default notificationSlice.reducer;