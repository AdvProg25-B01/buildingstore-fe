import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api/auth/';

const register = (name, email, password, role) => {
    return axios.post(API_URL + 'register', {
        name,
        email,
        password,
        role
    });
};

const login = (email, password) => {
    return axios.post(API_URL + 'login', {
        email,
        password
    });
};

const createUser = (name, email, password, role, token) => {
    return axios.post(API_URL + 'register', {
        name,
        email,
        password,
        role
    }, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

const logout = (token) => {
    return axios.post(API_URL + 'logout', null, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

const refreshToken = (refreshToken) => {
    return axios.post(API_URL + 'refresh-token', {
        refreshToken: refreshToken
    });
};

export default {
    register,
    login,
    createUser,
    logout,
    refreshToken
};