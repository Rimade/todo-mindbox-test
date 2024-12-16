import axios from 'axios';

const API_URL = 'https://0a247090441899f2.mokky.dev';

export const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});
