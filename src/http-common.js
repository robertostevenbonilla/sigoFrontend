import axios from "axios";

export default axios.create({
  //baseURL: "http://85.209.230.236/api",
  baseURL: "http://localhost:3000/apiv1",
  headers: {
    "Content-type": "application/json"
  }
});