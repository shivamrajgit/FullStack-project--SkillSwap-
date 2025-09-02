import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import pfpImage from '../assets/pfp.jpg';

axios.defaults.baseURL = "http://localhost:8000/api/v1/users";

export const loginUser = createAsyncThunk(
    'user/loginUser',
    async (credentials) => {
        const response = await axios.post('/login', credentials, { withCredentials: true });
        return response.data;
    }   
)

export const logoutUser = createAsyncThunk(
    'user/logoutUser',
    async () => {
        const response = await axios.post('/logout', {}, { withCredentials: true });
        return response.data;
    }
)

export const signupUser = createAsyncThunk(
    'user/signupUser',
    async (userInfo) => {
        const response = await axios.post('/sign-up', userInfo, { withCredentials: true });
        console.log(response.data);
        return response.data;
    }
)

export const updateAvatar = createAsyncThunk(
    'user/updateAvatar',
    async (formData) => {
        const response = await axios.post('/update-avatar', formData, {
            withCredentials: true,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    }
)

const userSlice = createSlice({
    name: 'user',
    initialState : {
        loading: false,
        isLoggedIn: false,
        error: null,
        success: null,
        id: null,
        avatar: null
    },
    reducers: {
        resetUserState: (state) => {
            state.loading = false;
            state.error = null;
            state.success = null;
        },
        setAvatar: (state, action) => {
            state.avatar = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
        // Signup User
            .addCase(signupUser.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.success = action.payload.message;
            })
            .addCase(signupUser.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = null;
            })
            .addCase(signupUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
                state.success = null;
            })
        // Login User
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isLoggedIn = true;
                state.error = null;
                state.success = action.payload.message;
                state.id = action.payload.data._id;
                state.avatar = action.payload.data.avatar;
            })
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.isLoggedIn = false;
                state.error = action.error.message;
                state.success = null;
            })
        // Logout User
            .addCase(logoutUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isLoggedIn = false;
                state.error = null;
                state.success = action.payload.message;
                state.id = null;
                state.avatar = null;
            })
        // Update Avatar
            .addCase(updateAvatar.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.avatar = action.payload.data.avatar;
            })
            .addCase(updateAvatar.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateAvatar.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
    },
});              

export default userSlice.reducer;
export const { resetUserState, setAvatar } = userSlice.actions;