import { AUTH_SET_AUTHENTICATED } from '../actionTypes';

const initialState = {
  token: '',
  email: '',
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case AUTH_SET_AUTHENTICATED:
      return {
        ...state,
        token: action.token,
        email: action.email,
      };
    default:
      return state;
  }
};
export default reducer;
