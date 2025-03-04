import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "./Room.css"; // Novo arquivo de estilos para layout

const Room = () => {
  const { roomId } = useParams();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const handleSendComment = () => {
    if (newComment.trim()) {
      setComments([...comments, newComment]);
      setNewComment("");
    }
  };

  return (
    <div className="room-container">
      <div className="left-panel">
        <h3>Sala: {roomId}</h3>
        <p>Nome do jogador: Milta</p>
      </div>

      <div className="game-area">
        {/* Aqui vai o jogo */}
        <h1>Jogo Aqui</h1>
      </div>

      <div className="chat-panel">
        <div className="chat-messages">
          {comments.map((comment, index) => (
            <p key={index}>{comment}</p>
          ))}
        </div>
        <input
          type="text"
          placeholder="Digite um comentário..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button onClick={handleSendComment}>Enviar</button>
      </div>
    </div>
  );
};

export default Room;
