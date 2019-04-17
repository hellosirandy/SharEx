import { getCoupleAPI } from '../../apis/couple';
import { checkAuthenticated } from './auth';
import { COUPLE_SET_COUPLE } from '../actionTypes';

export const getCouple = () => {
  return async (dispatch) => {
    const token = await dispatch(checkAuthenticated());
    const couple = await getCoupleAPI(token);
    dispatch(setCouple(couple));
  };
};

const setCouple = (couple) => {
  return {
    type: COUPLE_SET_COUPLE,
    couple,
  };
};

