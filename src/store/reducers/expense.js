import { EXPENSE_SET_EXPENSE, EXPENSE_APPEND_EXPENSE, EXPENSE_UPDATE_EXPENSE } from '../actionTypes';

const initialState = {
  expenses: [],
  expenseIds: [],
  expenseHash: {},
  total: 0,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case EXPENSE_SET_EXPENSE:
      return {
        ...state,
        expenses: action.expenses,
        total: action.total,
      };
    case EXPENSE_APPEND_EXPENSE:
      return {
        ...state,
        expenses: [action.expense, ...state.expenses],
      };
    case EXPENSE_UPDATE_EXPENSE:
      return {
        ...state,
        expenses: [...action.expenses],
        total: action.total,
      };
    default:
      return state;
  }
};
export default reducer;
