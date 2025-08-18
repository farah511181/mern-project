import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        loading: false,
        user: null,
        token: null,  // ✅ Add this line
    },
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setUser: (state, action) => {
            state.user = action.payload;
        },
        setToken: (state, action) => {  // ✅ Add this
            state.token = action.payload;
        },
        logout: (state) => {  // ✅ Optional: clear state on logout
            state.user = null;
            state.token = null;
            state.loading = false;
        }
    }
});

export const { setLoading, setUser, setToken, logout } = authSlice.actions;
export default authSlice.reducer;
