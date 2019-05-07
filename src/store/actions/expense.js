import { createExpenseAPI, getExpenseAPI, updateExpenseAPI, deleteExpenseAPI } from '../../apis/expense';
import { checkAuthenticated } from './auth';
import { uiStartLoading, uiStopLoading } from './ui';
import { EXPENSE_CREATING, EXPENSE_GETTING } from '../loadingTypes';
import { EXPENSE_SET_EXPENSE, EXPENSE_APPEND_EXPENSE, EXPENSE_UPDATE_EXPENSE } from '../actionTypes';

export const createExpense = (title, total, paid, shouldPay, date, expenseId = null, index = null) => {
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
        const updatedExpense = await updateExpenseAPI(token, body);
        const { expenses } = getState().expense;
        expenses[index] = updatedExpense;
        let expensesTotal = 0;
        expenses.forEach((expense) => {
          expensesTotal += expense.paid - expense.shouldPay;
        });
        dispatch(updateExpense(expenses, expensesTotal));
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

export const deleteExpense = (expenseId, index) => {
  return async (dispatch, getState) => {
    const token = await dispatch(checkAuthenticated());
    dispatch(uiStartLoading(EXPENSE_CREATING));
    try {
      await deleteExpenseAPI(token, expenseId);
      dispatch(uiStopLoading(EXPENSE_CREATING));
      const { expenses } = getState().expense;
      delete expenses[index];
      let expensesTotal = 0;
      expenses.forEach((expense) => {
        expensesTotal += expense.paid - expense.shouldPay;
      });
      dispatch(updateExpense(expenses, expensesTotal));
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

const updateExpense = (expenses, total) => {
  return {
    type: EXPENSE_UPDATE_EXPENSE,
    expenses,
    total,
  };
}
;