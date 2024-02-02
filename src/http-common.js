import axios from "axios";

export default axios.create({
  //baseURL: "http://85.209.230.236/api",
  baseURL: "http://localhost:8880/api",
  headers: {
    "Content-type": "application/json"
  }
});