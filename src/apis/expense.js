import API from './api';

const api = new API();

export const createExpenseAPI = (token, body) => {
  return api.post('/couple/expense', token, body);
};

export const updateExpenseAPI = (token, body) => {
  return api.put('/couple/expense', token, body);
};

export const deleteExpenseAPI = (token, expenseId) => {
  const params = {
    expenseId,
  };
  return api.delete('/couple/expense', token, params);
};

export const getExpenseAPI = (token) => {
  return api.get('/couple/expense', token);
};

