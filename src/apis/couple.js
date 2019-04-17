import API from './api';

const api = new API();

export const getCoupleAPI = (token) => {
  return api.get('/couple', token);
};

