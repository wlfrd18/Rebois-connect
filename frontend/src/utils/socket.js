import { io } from "socket.io-client";

export const socket = io("http://localhost:5000/api/v1", {
  auth: {
    token: localStorage.getItem("access_token"),
  },
});
