import { EXPENSE_SET_EXPENSE, EXPENSE_APPEND_EXPENSE } from '../actionTypes';

const initialState = {
  expenses: [],
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
        expenses: [...state.expenses, action.expense],
      };
    default:
      return state;
  }
};
export default reducer;
