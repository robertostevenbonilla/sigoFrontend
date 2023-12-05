import { store } from "../reducers/index";

export const AuthHeader = () => {

  const header = () => {
    const auth = store.getState().auth;
    const currentUser = auth.auth.auth;
    if (currentUser && currentUser.accessToken) {
      return { Authorization: "Bearer " + currentUser.accessToken };
    } else {
      return {};
    }
  };

  return {
    header
  }
};
