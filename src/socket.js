import { io } from "socket.io-client";

const socket = io("http://localhost:3000"); // Ajuste conforme necessário

export const entrarSala = (sala, nomeJogador) => {
    socket.emit("entrarSala", sala, nomeJogador);
} 

export default socket;