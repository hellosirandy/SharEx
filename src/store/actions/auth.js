import { signInAPI, signOutAPI, checkAuthenticatedAPI, signUpAPI, completeNewPasswordAPI } from '../../apis/auth';
import { AUTH_SET_AUTHENTICATED } from '../actionTypes';
import { uiStartLoading, uiStopLoading } from './ui';
import { AUTH_SIGNIN } from '../loadingTypes';
import { getCouple } from './couple';
import { getExpense } from './expense';

export const signIn = (email, password) => {
  return async (dispatch) => {
    try {
      dispatch(uiStartLoading(AUTH_SIGNIN));
      const token = await signInAPI(email, password);
      await Promise.all([dispatch(getCouple()), dispatch(getExpense())])
      dispatch(setAuthenticated(token, email));
      dispatch(uiStopLoading(AUTH_SIGNIN));
    } catch (e) {
      dispatch(uiStopLoading(AUTH_SIGNIN));
      if (e === 'NEW_PASSWORD_REQUIRED') {
        throw e;
      }
      if (e.code === 'UserNotConfirmedException') {
        throw Object({ needConfirmation: true });
      } else {
        throw String('Incorrect email/password');
      }
    }
  };
};

export const signUp = (email: string, password: string) => {
  return async () => {
    try {
      await signUpAPI(email, password);
    } catch (e) {
      if (e.code === 'UsernameExistsException') {
        throw String('User already exists');
      } else {
        throw String('Invalid email/password');
      }
    }
  };
};

export const signOut = () => {
  return async (dispatch) => {
    await signOutAPI();
    dispatch(setAuthenticated(null));
  };
};

export const checkAuthenticated = () => {
  return async (dispatch) => {
    try {
      const { token, email } = await checkAuthenticatedAPI();
      console.log(token);
      // const { auth: { token: oldToken } } = getState();
      // if (token !== oldToken) {
      //   console.log(token);
      //   dispatch(setAuthenticated(token, email));
      // }
      dispatch(setAuthenticated(token, email));
      return token;
    } catch (e) {
      console.log(e);
      dispatch(setAuthenticated(null));
    }
  };
};

export const completeNewPassword = (email: string, password: string, newPassword: string) => {
  return async (dispatch) => {
    dispatch(uiStartLoading(AUTH_SIGNIN));
    const token = await completeNewPasswordAPI(email, password, newPassword);
    console.log(token);
    // dispatch(setAuthenticated(token, email));
    dispatch(uiStopLoading(AUTH_SIGNIN));
  };
};

const setAuthenticated = (token, email) => {
  return {
    type: AUTH_SET_AUTHENTICATED,
    token,
    email,
  };
};

