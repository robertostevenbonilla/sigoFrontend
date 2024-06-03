import axios from "axios";

export default axios.create({
  //baseURL: "https://85.209.230.236/apiv1",
  baseURL: "https://sigo.robsul.com/apiv1",
  //baseURL: "http://localhost:3000/apiv1",
  //baseURL: "https://sigo.goyaexpressdelivery.com/apiv1",
  headers: {
    "Content-type": "application/json"
  }
});
