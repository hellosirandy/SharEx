import { UI_START_LOADING, UI_STOP_LOADING } from '../actionTypes';

const initialState = {
  isLoading: {},
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case UI_START_LOADING:
      return {
        ...state,
        isLoading: {
          ...state.isLoading,
          [action.loadingType]: true,
        },
      };
    case UI_STOP_LOADING:
      return {
        ...state,
        isLoading: {
          ...state.isLoading,
          [action.loadingType]: false,
        },
      };
    default:
      return state;
  }
};

export default reducer;
