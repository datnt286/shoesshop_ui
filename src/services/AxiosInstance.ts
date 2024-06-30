import axios from 'axios';
import config from './config';

const AxiosInstance = axios.create({
    baseURL: config.apiURL,
});

AxiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        return Promise.reject(error);
    },
);

export default AxiosInstance;
