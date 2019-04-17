import Amplify, { Auth } from 'aws-amplify';

const poolDatas = {
  dev: {
    userPoolId: 'us-east-1_rnZDON91V',
    userPoolWebClientId: '5ak23h84ni4l3eh26627e7fhkq',
  },
};

Amplify.configure({
  Auth: {
    region: 'us-east-1',
    ...poolDatas.dev,
  },
});

export const checkAuthenticatedAPI = async () => {
  const user = await Auth.currentAuthenticatedUser();
  // const session = await Auth.currentSession();
  if (user.signInUserSession.isValid()) {
    return {
      token: user.signInUserSession.getIdToken().getJwtToken(),
      email: user.attributes.email,
    };
  }
  throw String('Token is invalud');
};

export const signOutAPI = () => {
  return Auth.signOut();
};

export const signUpAPI = (email: string, password: string) => {
  return Auth.signUp({
    username: email,
    password,
    attributes: { email },
  });
};

export const signInAPI = async (email: string, password: string) => {
  const user = await Auth.signIn(email, password);
  if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
    throw String('NEW_PASSWORD_REQUIRED');
  }
  return user.signInUserSession.getIdToken().getJwtToken();
};

export const confirmUserAPI = (email: string, code: string) => {
  return Auth.confirmSignUp(email, code);
};

export const changePasswordAPI = async (oldPassword: string, newPassword: string) => {
  const user = await Auth.currentAuthenticatedUser();
  return Auth.changePassword(user, oldPassword, newPassword);
};

export const completeNewPasswordAPI = async (email, password, newPassword) => {
  const user = await Auth.signIn(email, password);
  const newUser = await Auth.completeNewPassword(
    user,
    newPassword,
  );
  return newUser;
};

