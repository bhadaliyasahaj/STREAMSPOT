import {createSlice} from "@reduxjs/toolkit"

const initialState = {
    currentUser:null,
    loading:false,
    error:false
}

export const userSlice = createSlice({
    name:'user',
    initialState,
    reducers:{
        loginStart:(state)=>{
            state.loading=true
        },
        loginSuccess:(state,action)=>{
            state.loading=false
            state.currentUser = action.payload
        },
        loginFailure:(state)=>{
            state.loading=false
            state.error=true
        },
        logout:(state)=>{
            state.currentUser = null
            state.error = false
            state.loading=false
        },
        subscription:(state,action)=>{
            if(!state.currentUser.subscribedUsers.includes(action.payload)){
                state.currentUser.subscribedUsers.push(action.payload)
            }else{
                state.currentUser.subscribedUsers.splice(state.currentUser.subscribedUsers.findIndex((channelId)=> channelId === action.payload))
            }
        }
    }
})


export const {loginStart,loginSuccess,loginFailure,logout,subscription} = userSlice.actions

export default userSlice.reducer