import { LAYOUT, MENU_BEHAVIOUR, NAV_COLOR, MENU_PLACEMENT, RADIUS, THEME_COLOR, USER_ROLE } from 'constants.js';

export const IS_DEMO = false;
export const IS_AUTH_GUARD_ACTIVE = true;
export const SERVICE_URL = '/app';
export const USE_MULTI_LANGUAGE = false;
export const API_URL = 'https://api-homolog.contaprivilege.com.br';
export const APP_URL = 'https://app-homolog.contaprivilege.com.br';
// export const API_URL = 'http://localhost:8000'
// export const APP_URL = 'http://localhost:3000'


export const REACT_HELMET_PROPS = {
	defaultTitle: 'Privilege',
	titleTemplate: '%s | Admin Privilege',
};

export const DEFAULT_PATHS = {
	APP: '/',
	LOGIN: '/login',
	REGISTER: '/register',
	FORGOT_PASSWORD: '/forgot-password',
	RESET_PASSWORD: '/reset-password',
	USER_WELCOME: '/dashboards/default',
	NOTFOUND: '/page-not-found',
	UNAUTHORIZED: '/unauthorized',
	INVALID_ACCESS: '/invalid-access',
};

export const DEFAULT_SETTINGS = {
	MENU_PLACEMENT: MENU_PLACEMENT.Vertical,
	MENU_BEHAVIOUR: MENU_BEHAVIOUR.Pinned,
	LAYOUT: LAYOUT.Boxed,
	RADIUS: RADIUS.Rounded,
	// COLOR: THEME_COLOR.DarkRed,
	COLOR: THEME_COLOR.DarkBlue,
	NAV_COLOR: NAV_COLOR.Default,
	USE_SIDEBAR: false,
};

export const DEFAULT_USER = {
	id: 1,
	name: 'Lisa Jackson',
	thumb: '/img/profile/profile-9.webp',
	role: USER_ROLE.Admin,
	email: 'lisajackson@gmail.com',
};

export const REDUX_PERSIST_KEY = 'admin-privilege';
