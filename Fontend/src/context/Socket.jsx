import { io } from "socket.io-client";

const FRONTEND_URL = "http://localhost:5173"; 
const BACKEND = "http://localhost:3000";

export const socket = io(BACKEND, {
  withCredentials: true,
});
