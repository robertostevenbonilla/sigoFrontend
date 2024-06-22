import axios from "axios";

export default axios.create({
  baseURL: process.env.REACT_APP_URL + "apiv1",
  headers: {
    "Content-type": "application/json"
  }
});
