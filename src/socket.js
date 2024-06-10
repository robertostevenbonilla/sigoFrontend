import { io } from "socket.io-client";
import { store } from "./reducers/index";

// "undefined" means the URL will be computed from the `window.location` object
const URL =
  process.env.NODE_ENV === "production" ? undefined : "http://localhost:3000";
  const token = store.getState().auth?.auth?.auth?.accessToken;
  const socketOptions = {
      transportOptions: {
          polling: {
              extraHeaders: {
                  token, // 'h93t4293t49jt34j9rferek...'
              }
          }
      }
  }

export const socket = io(URL, socketOptions);
