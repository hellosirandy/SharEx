import { createExpenseAPI, getExpenseAPI, updateExpenseAPI, deleteExpenseAPI } from '../../apis/expense';
import { checkAuthenticated } from './auth';
import { uiStartLoading, uiStopLoading } from './ui';
import { EXPENSE_CREATING, EXPENSE_GETTING } from '../loadingTypes';
import { EXPENSE_SET_EXPENSE, EXPENSE_APPEND_EXPENSE } from '../actionTypes';

export const createExpense = (title, total, paid, shouldPay, date, expenseId = null) => {
  return async (dispatch, getState) => {
    dispatch(uiStartLoading(EXPENSE_CREATING));
    const { couple } = getState().couple;
    const token = await dispatch(checkAuthenticated());
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
    const body = {
      title,
      coupleId: couple.id,
      date,
      data,
    };
    try {
      if (expenseId) {
        body.expenseId = expenseId;
        await updateExpenseAPI(token, body);
      } else {
        const newExpense = await createExpenseAPI(token, body);
        dispatch(appendExpense(newExpense));
      }
      dispatch(uiStopLoading(EXPENSE_CREATING));
    } catch (e) {
      console.log(e);
      dispatch(uiStopLoading(EXPENSE_CREATING));
    }
  };
};

export const deleteExpense = (expenseId) => {
  return async (dispatch) => {
    const token = await dispatch(checkAuthenticated());
    dispatch(uiStartLoading(EXPENSE_CREATING));
    try {
      await deleteExpenseAPI(token, expenseId);
      dispatch(uiStopLoading(EXPENSE_CREATING));
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
      expenses.forEach((expense) => {
        total += expense.paid - expense.shouldPay;
      });
      dispatch(setExpense(expenses.reverse(), total));
      dispatch(uiStopLoading(EXPENSE_GETTING));
    } catch (e) {
      dispatch(uiStopLoading(EXPENSE_GETTING));
    }
    dispatch(uiStopLoading(EXPENSE_GETTING));
  };
};

const setExpense = (expenses, total) => {
  return {
    type: EXPENSE_SET_EXPENSE,
    expenses,
    total,
  };
};

const appendExpense = (expense) => {
  return {
    type: EXPENSE_APPEND_EXPENSE,
    expense,
  };
};
