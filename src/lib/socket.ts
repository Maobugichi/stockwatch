import { io } from "socket.io-client";


let user_id
const userData = localStorage.getItem("user-data");
if (userData) {
    const parsedData = JSON.parse(userData);
    user_id = parsedData.userId
}


export const socket = io("https://stocks-server-kcro.onrender.com", {
    query:{ userId: user_id},
    transports: ["websocket"],
})