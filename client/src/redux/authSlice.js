import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        login: {
            currentUser: null,
            role: null,
            id: null,
            name: null,
            image: null,
            isFetching: false,
            error: false,
        }
    },
    reducers: {
        loginStart: (state) => {
            state.login.isFetching = true;
        },
        loginSuccess: (state, action) => {
            state.login.isFetching = false;
            state.login.currentUser = action.payload;
            state.login.error = false;
        },
        loginFailed: (state) => {
            state.login.isFetching = false;
            state.login.error = true;
            state.login.currentUser = null;
        },
        setRole: (state, action) => {
            state.login.role = action.payload;
        },
        setId: (state, action) => {
            state.login.id = action.payload;
        },
        setName: (state, action) => {
            state.login.name = action.payload;
        },
        setImage: (state, action) => {
            state.login.image = action.payload;
        },
        logOutStart: (state) => {
            state.login.isFetching = true;
        },
        logOutSuccess: (state) => {
            state.login.isFetching = false;
            state.login.currentUser = null;
            state.login.role = null;
            state.login.error = false;
        },
        logOutFailed: (state) => {
            state.login.isFetching = false;
            state.login.error = true;
        }
    }
})

export const {
    loginStart,
    loginSuccess,
    loginFailed,
    setRole,
    setId,
    setName,
    setImage,
    logOutStart,
    logOutSuccess,
    logOutFailed
} = authSlice.actions;

export const selectAuth = (state) => state.auth;

export default authSlice.reducer;