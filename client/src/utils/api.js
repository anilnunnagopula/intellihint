import axios from "axios";

// Create an Axios instance with a base URL for your backend
const api = axios.create({
  baseURL: "http://localhost:5000/api", // Your Node.js backend URL
});

// Request interceptor to add the JWT token to every outgoing request
api.interceptors.request.use(
  (config) => {
    // Get the token from localStorage
    const token = localStorage.getItem("token");
    // If a token exists, add it to the Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config; // Return the modified config
  },
  (error) => {
    // Handle request errors
    return Promise.reject(error);
  }
);

// You can also add a response interceptor here to handle
// global errors (e.g., 401 Unauthorized) or refresh tokens.
/*
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized errors, e.g., redirect to login
      console.log('Unauthorized request, redirecting to login...');
      // Example: window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
*/

export default api;
