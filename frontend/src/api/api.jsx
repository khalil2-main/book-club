import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // adding the /api route atomatically
  withCredentials: true // cookies
});

export default api;
