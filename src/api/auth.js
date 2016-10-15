import { get, post } from '../utils/ajax';

const baseURL = process.env.URL || 'http://localhost:8080';

export const fetchSession = () => get(`${baseURL}/session`);

export const trySignup = (credentials) => post(`${baseURL}/signup`, credentials);

export const tryLogin = (credentials) => post(`${baseURL}/login`, credentials);

export const tryLogout = () => get(`${baseURL}/logout`);

const auth = {
  fetchSession,
  trySignup,
  tryLogin,
  tryLogout
};

export default auth;
