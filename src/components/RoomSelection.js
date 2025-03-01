import React, { useState } from "react";
import "./RoomSelection.css";
const RoomSelection = ({ onRoomSelect }) => {
  const [roomName, setRoomName] = useState("");
  const [nickname, setNickname] = useState("");

  const handleJoinRoom = () => {
    if (roomName.trim() && nickname.trim()) {
      onRoomSelect({ roomName, nickname });
    } else {
      alert("Digite um nome e escolha uma sala!");
    }
  };

  return (
    <div className="room-selection">
      <h1>Escolha uma Sala</h1>
      <input
        type="text"
        placeholder="Digite seu nome"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
      />
      <input
        type="text"
        placeholder="Nome da Sala"
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
      />
      <button onClick={handleJoinRoom}>Entrar</button>
    </div>
  );
};

export default RoomSelection;
