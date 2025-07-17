// src/socket.js
import { io } from "socket.io-client";

const socket = io("http://localhost:5000/api/v1", {
  transports: ["websocket"],
  withCredentials: true,
});

export default socket;
