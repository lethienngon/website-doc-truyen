import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        login: {
            currentUser: null,
            isFetching: false,
            error: false,
            waitSubmit: false,
        }
    },
    reducers: {
        loginStart: (state) => {
            state.login.isFetching = true;
            state.login.waitSubmit = true;
        },
        loginSuccess: (state, action) => {
            state.login.isFetching = false;
            state.login.currentUser = action.payload;
            state.login.error = false;
            state.login.waitSubmit = false;
        },
        loginFailed: (state) => {
            state.login.isFetching = false;
            state.login.error = true;
            state.login.waitSubmit = false;
        }
    }
})

export const {
    loginStart,
    loginSuccess,
    loginFailed
} = authSlice.actions;

export const selectAuth = (state) => state.auth;

export default authSlice.reducer;