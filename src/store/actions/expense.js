import { createExpenseAPI, getExpenseAPI, updateExpenseAPI, deleteExpenseAPI } from '../../apis/expense';
import { checkAuthenticated } from './auth';
import { uiStartLoading, uiStopLoading } from './ui';
import { EXPENSE_CREATING, EXPENSE_GETTING } from '../loadingTypes';
import { EXPENSE_SET_EXPENSE, EXPENSE_APPEND_EXPENSE, EXPENSE_UPDATE_EXPENSE, EXPENSE_DELETE_EXPENSE } from '../actionTypes';

export const createExpense = (options) => {
  return async (dispatch, getState) => {
    dispatch(uiStartLoading(EXPENSE_CREATING));
    const token = await dispatch(checkAuthenticated());
    const { couple } = getState().couple;
    const body = makeExpense({
      ...options,
      couple,
    });
    try {
      const newExpense = await createExpenseAPI(token, body);
      dispatch(appendExpense(newExpense));
      dispatch(uiStopLoading(EXPENSE_CREATING));
    } catch (e) {
      console.log(e);
      dispatch(uiStopLoading(EXPENSE_CREATING));
    }
  };
};

export const updateExpense = (options) => {
  return async (dispatch, getState) => {
    dispatch(uiStartLoading(EXPENSE_CREATING));
    const token = await dispatch(checkAuthenticated());
    const { couple } = getState().couple;
    const body = makeExpense({
      ...options,
      couple,
    });
    try {
      const updatedExpense = await updateExpenseAPI(token, body);
      dispatch({
        type: EXPENSE_UPDATE_EXPENSE,
        updatedExpense,
      });
      dispatch(uiStopLoading(EXPENSE_CREATING));
    } catch (e) {
      console.log(e);
      dispatch(uiStopLoading(EXPENSE_CREATING));
    }
  };
};

const makeExpense = (options) => {
  const {
    couple, paid, shouldPay, total, title, date, expenseId, category,
  } = options;
  const data = {
    [couple.you.email]: {
      paid,
      shouldPay,
    },
    [couple.partner.email]: {
      paid: total - paid,
      shouldPay: total - shouldPay,
    },
  };
  return {
    title,
    coupleId: couple.id,
    date,
    data,
    expenseId,
    category,
  };
};

export const deleteExpense = (expenseId) => {
  return async (dispatch, getState) => {
    const token = await dispatch(checkAuthenticated());
    dispatch(uiStartLoading(EXPENSE_CREATING));
    try {
      await deleteExpenseAPI(token, expenseId);
      dispatch(uiStopLoading(EXPENSE_CREATING));
      const { expenseIds, expenseTable } = getState().expense;
      const deletedExpense = expenseTable[expenseId];
      delete expenseTable[expenseId];
      dispatch({
        type: EXPENSE_DELETE_EXPENSE,
        expenseIds,
        deletedExpense,
      });
    } catch (e) {
      console.log(e);
      dispatch(uiStopLoading(EXPENSE_CREATING));
    }
  };
};

export const getExpense = () => {
  return async (dispatch) => {
    dispatch(uiStartLoading(EXPENSE_GETTING));
    const token = await dispatch(checkAuthenticated());
    try {
      const expenses = await getExpenseAPI(token);
      let total = 0;
      const expenseTable = {};
      expenses.forEach((expense) => {
        total += expense.paid - expense.shouldPay;
        expenseTable[expense.id] = expense;
      });
      const expenseIds = expenses.map(expense => expense.id);
      dispatch(setExpense(expenseIds.reverse(), expenseTable, parseFloat(total.toFixed(3))));
      dispatch(uiStopLoading(EXPENSE_GETTING));
    } catch (e) {
      dispatch(uiStopLoading(EXPENSE_GETTING));
    }
    dispatch(uiStopLoading(EXPENSE_GETTING));
  };
};

const setExpense = (expenseIds, expenseTable, total) => {
  return {
    type: EXPENSE_SET_EXPENSE,
    expenseIds,
    expenseTable,
    total,
  };
};

const appendExpense = (expense) => {
  return {
    type: EXPENSE_APPEND_EXPENSE,
    expense,
  };
};

