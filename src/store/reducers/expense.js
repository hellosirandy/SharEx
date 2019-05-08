import { EXPENSE_SET_EXPENSE, EXPENSE_APPEND_EXPENSE, EXPENSE_UPDATE_EXPENSE, EXPENSE_DELETE_EXPENSE } from '../actionTypes';

const initialState = {
  expenseIds: [],
  expenseTable: {},
  total: 0,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case EXPENSE_SET_EXPENSE:
      return {
        ...state,
        expenseIds: action.expenseIds,
        expenseTable: action.expenseTable,
        total: action.total,
      };
    case EXPENSE_APPEND_EXPENSE:
      return {
        ...state,
        expenseIds: [action.expense.id, ...state.expenseIds],
        expenseTable: { ...state.expenseTable, [action.expense.id]: action.expense },
        total: state.total + (action.expense.paid - action.expense.shouldPay),
      };
    case EXPENSE_UPDATE_EXPENSE:
      const prevExpense = state.expenseTable[action.updatedExpense.id];
      const prevDiff = prevExpense.paid - prevExpense.shouldPay;
      const updatedDiff = action.updatedExpense.paid - action.updatedExpense.shouldPay;
      return {
        ...state,
        expenseTable: {
          ...state.expenseTable,
          [action.updatedExpense.id]: action.updatedExpense,
        },
        total: state.total - prevDiff + updatedDiff,
      };
    case EXPENSE_DELETE_EXPENSE:
      const expenseIds = state.expenseIds.filter(expense => expense.id !== action.deletedExpense.id);
      return {
        ...state,
        expenseIds,
        total: state.total - (action.deletedExpense.paid - action.deletedExpense.shouldPay),
      };
    default:
      return state;
  }
};
export default reducer;
