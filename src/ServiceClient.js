import axios from 'axios';
const axiosClient = axios.create({
  baseURL: 'http://192.168.4.1',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

// axiosClient.interceptors.request.use(
//   config => {
//     const token = localStorage.getItem('token');
//     console.log('service-token');
//     if (token) {
//       config.headers['Authorization'] = `Bearer ${token}`;
//     }
//     return config;
//   },
//   error => {
//     return Promise.reject(error);
//   },
// );

// axiosClient.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   (error) => {
//     if (error.response && error.response.status === 401) {
//       localStorage.removeItem("token"); // Clear token
//       window.location.href = "/app-login";
//     }
//     return Promise.reject(error);
//   }
// );

// axiosClient.interceptors.response.use(
//   function (response) {
//     return response;
//   },
//   function (error) {
//     let res = error.response;
//     console.log('error:' + res);
//     return Promise.reject(error);
//   },
// );

export default axiosClient;
