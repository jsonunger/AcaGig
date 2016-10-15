import { get, post } from '../utils/ajax';

export const fetchSession = () => get('/session');

export const trySignup = (credentials) => post('/signup', credentials);

export const tryLogin = (credentials) => post('/login', credentials);

export const tryLogout = () => get('/logout');

const auth = {
  fetchSession,
  trySignup,
  tryLogin,
  tryLogout
};

export default auth;
