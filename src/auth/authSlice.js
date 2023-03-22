import { createSlice } from '@reduxjs/toolkit';
import { DEFAULT_USER, IS_DEMO } from 'config.js';

const initialState = {
	isLogin: IS_DEMO,
	currentUser: IS_DEMO ? DEFAULT_USER : {},
};

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		setCurrentUser(state, action) {
			state.currentUser = action.payload;
			state.isLogin = true;
		},

		setIsLogin(state, action){
			state.isLogin = false;
		}
	},
});

export const { setCurrentUser, setIsLogin } = authSlice.actions;

const authReducer = authSlice.reducer;

export const userChangeState = (user) => async (dispatch) => {
	dispatch(setCurrentUser(user));
};

export const userLogout = (user) => async (dispatch) => {
	dispatch(setIsLogin());
};

export default authReducer;
