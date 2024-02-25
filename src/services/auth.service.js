import http from "../http-common";
import { AuthHeader } from "./auth-header";

const loginAPI = async (data) => {
  const response = await http.post("/auth/signin", data);
  return response.data;
};

const signupAPI = async (data) => {
  const { header } = AuthHeader();
  const token = header();
  const response = await http.post("/auth/signup", data, { headers: {...token} });
  return response.data;
};

const logoutAPI = () => {
  //localStorage.removeItem("user");
};

const resetPassword = async (data) => {
  const { header } = AuthHeader();
  const token = header();
  const response = await http.post("/auth/resetpassword", data, { headers: {...token} });
  return response.data;
};

const AuthDataService = {
  loginAPI,
  signupAPI,
  logoutAPI,
  resetPassword,
};

export default AuthDataService;
