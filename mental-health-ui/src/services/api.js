import axios from 'axios';

const api = axios.create({
  baseURL: 'https://lab5-20nt.onrender.com' 
});

export default api;