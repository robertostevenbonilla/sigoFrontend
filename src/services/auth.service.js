import http from "../http-common";
import { store } from "../reducers/index";
import { AuthHeader } from "./auth-header";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setAuth } from "../reducers/auth";

export const AuthDataService = () => {
  let navigate = useNavigate();
  const dispatch = useDispatch();

  const loginAPI = async (data) => {
    const response = await http.post("/auth/signin", data);
    return response.data;
  };

  const signupAPI = async (data) => {
    const { header } = AuthHeader();
    const token = header();
    const response = await http.post("/auth/signup", data, {
      headers: { ...token },
    });
    return response.data;
  };

  const logoutAPI = () => {
    //localStorage.removeItem("user");
  };

  const refreshToken = async () => {
    const auth = store.getState().auth.auth.auth;
    console.log("Refreshing token", auth);
    const response = await http.post(
      "/auth/refreshToken",
      {},
      { headers: { Authorization: "Bearer " + auth.refreshToken } }
    );
    return response.data;
  };

  const resetPasswordAPI = async (data) => {
    const { header } = AuthHeader();
    const token = header();
    const response = await http.post("/auth/resetpassword", data, {
      headers: { ...token },
    });
    return response.data;
  };

  const refreshTokenProcess = async () => {
    try {
      const response = await refreshToken();
      console.log(response);
      const auth = store.getState().auth.auth.auth;
      const authData = {
        isLoggedIn: true,
        auth: { ...auth, ...response },
      };
      localStorage.setItem("userAuth", JSON.stringify({ ...authData }));
      dispatch(setAuth({ ...authData }));
      return true;
    } catch (error) {
      console.error("refreshTokenProcess",error);
      if (error.response.status === 403) {
        const response = await logoutAPI();
        const auth = {
          isLoggedIn: false,
          auth: null,
        };
        localStorage.removeItem("userAuth");
        window.localStorage.clear();
        dispatch(setAuth(auth));
        navigate("/login");
        return false;
      } else {
        throw error;
      }
    }
  };

  return {
    loginAPI,
    signupAPI,
    logoutAPI,
    refreshToken,
    resetPasswordAPI,
    refreshTokenProcess,
  };
};
