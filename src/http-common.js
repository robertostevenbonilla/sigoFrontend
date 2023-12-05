import axios from "axios";

export default axios.create({
  //baseURL: "https://48a0-157-100-104-124.ngrok-free.app/api",
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-type": "application/json"
  }
});