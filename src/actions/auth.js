import { useDispatch } from "react-redux";
import AuthDataService from "../services/auth.service";
import { setAuth } from "../reducers/auth";
import { setMessage, setOpenModal } from "../reducers/message";

export const UserAuth = () => {
  const dispatch = useDispatch();

  const login = async (username, password) => {
    try {
      const response = await AuthDataService.loginAPI(username, password);
      console.log("Login response",response);
      const auth = {
        isLoggedIn: true,
        auth: response,
      };
      localStorage.setItem("userAuth", JSON.stringify({ ...auth }));
      dispatch(setAuth({ ...auth }));
    } catch (error) {
      const msg =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      console.log(msg);
      const message = {
        title: "Inicio de sesión",
        msg: msg,
        error: true,
      };
      dispatch(setMessage({ ...message }));
      dispatch(setOpenModal(true));
      const auth = {
        isLoggedIn: false,
        user: null,
      };
      dispatch(setAuth(auth));
    }
  };

  const logout = async () => {
    const response = await AuthDataService.logoutAPI();
    const auth = {
      isLoggedIn: false,
      auth: null,
    };
    localStorage.removeItem("userAuth");
    window.localStorage.clear();
    dispatch(setAuth(auth));
  };

  const signup = async (data) => {
    console.log("signup");
    const response = await AuthDataService.signupAPI(data);
    console.log(response);
    try {
    } catch (e) {
      console.log(e);
    }
  };

  const resetPassword = async (data) => {
    console.log("resetPassword",data);
    const response = await AuthDataService.resetPassword(data);
    console.log(response);
  };

  return {
    login,
    logout,
    signup,
    resetPassword,
  };
};
