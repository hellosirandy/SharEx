import { COUPLE_SET_COUPLE } from '../actionTypes';

const initialState = {
  couple: {},
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case COUPLE_SET_COUPLE:
      return {
        ...state,
        couple: action.couple,
      };
    default:
      return state;
  }
};
export default reducer;
