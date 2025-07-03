// import axios from 'axios';

// const token = localStorage.getItem('token');

// const api = axios.create({
//   baseURL: '/',
//   headers: {
//     'Authorization': `Bearer ${token}`,
//   },
// });

// export const login = (employeeId, password) => async (dispatch) => {
//   try {
//     const response = await api.post('/login', { employeeId, password });
//     console.log('Login response:', response.data); // Debug log
//     dispatch({ type: 'LOGIN_SUCCESS', payload: response.data });
//   } catch (error) {
//     console.error('Login error:', error.response? error.response.data : error.message); // Debug log
//     dispatch({ type: 'LOGIN_FAILURE', payload: error.response? error.response.data : { message: error.message } });
//     throw error;
//   }
// };

// export const getUser = (employeeId) => async (dispatch) => {
//   try {
//     const response = await api.post('/get-user', { employeeId });
//     dispatch({ type: 'GET_USER_SUCCESS', payload: response.data });
//   } catch (error) {
//     dispatch({ type: 'GET_USER_FAILURE', payload: error.response.data });
//     throw error;
//   }
// };



// src/actions/authActions.js
import api from '../api';  // Adjust the path if needed

export const login = (employeeId, password) => async (dispatch) => {
  try {
    const response = await api.post('/login', { employeeId, password });
    console.log('Login response:', response.data);
    dispatch({ type: 'LOGIN_SUCCESS', payload: response.data });
  } catch (error) {
    console.error('Login error:', error.response ? error.response.data : error.message);
    dispatch({
      type: 'LOGIN_FAILURE',
      payload: error.response ? error.response.data : { message: error.message },
    });
    throw error;
  }
};

export const getUser = (employeeId) => async (dispatch) => {
  try {
    const response = await api.post('/get-user', { employeeId });
    dispatch({ type: 'GET_USER_SUCCESS', payload: response.data });
  } catch (error) {
    dispatch({
      type: 'GET_USER_FAILURE',
      payload: error.response ? error.response.data : { message: error.message },
    });
    throw error;
  }
};
