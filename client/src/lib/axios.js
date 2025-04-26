// src/lib/axios.js or wherever you want
import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:4000', // your backend port
  withCredentials: true, // if you’re using cookies for auth
});

export default instance;
