import axios from "axios";

export default axios.create({
  //baseURL: "https://85.209.230.236/apiv1",
  //baseURL: "https://sigo.robsul.com/apiv1",
  baseURL: process.env.REACT_APP_URL + "apiv1",
  //baseURL: "https://sigo.robsul.com/apiv1",
  headers: {
    "Content-type": "application/json"
  }
});
