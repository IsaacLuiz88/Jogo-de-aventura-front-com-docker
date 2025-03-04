import React, { useState } from "react";
import WelcomeScreen from "./components/WelcomeScreen"; // Tela de boas-vindas
import AvatarSelection from "./components/AvatarSelection"; // Tela de seleção de avatar
import DifficultySelection from "./components/DifficultySelection"; // Tela de seleção de dificuldade
import RoomSelection from "./components/RoomSelection"; // Tela de seleção de sala
import Game from "./components/Game"; // Tela de jogo
import GameOver from "./components/GameOver"; // Tela de Game Over

const App = () => {
  const [step, setStep] = useState("welcome"); // Inicializa com a tela de boas-vindas
  const [playerData, setPlayerData] = useState({}); // Estado para armazenar os dados do jogador
  const [difficulty, setDifficulty] = useState(""); // Estado para armazenar a dificuldade

  // Função chamada quando o jogador clica para começar o jogo na tela de boas-vindas
  const handleStartGame = () => {
    setStep("avatar"); // Avança para a tela de seleção de avatar
  };

  // Função chamada quando o jogador seleciona o avatar
  const handleAvatarSelect = (data) => {
    setPlayerData((prev) => ({ ...prev, ...data })); // Armazena os dados do jogador
    setStep("difficulty"); // Avança para a tela de seleção de dificuldade
  };

  // Função chamada quando o jogador seleciona a dificuldade
  const handleDifficultySelect = (level) => {
    setDifficulty(level); // Salva a dificuldade selecionada
    setStep("room"); // Avança para a tela de seleção de sala
  };

  // Função chamada quando o jogador seleciona a sala
  const handleRoomSelect = (data) => {
    setPlayerData((prev) => ({ ...prev, ...data })); // Salva os dados da sala
    setStep("game"); // Avança para a tela do jogo
  };

  // Função chamada quando o jogo termina e o jogador quer voltar para a sala
  const handleGameOver = () => {
    setStep("room"); // Retorna para a tela de seleção de sala
  };

  return (
    <div>
      {/* Tela de boas-vindas */}
      {step === "welcome" && <WelcomeScreen onPlay={handleStartGame} />}

      {/* Tela de seleção de avatar */}
      {step === "avatar" && <AvatarSelection onAvatarSelect={handleAvatarSelect} />}

      {/* Tela de seleção de dificuldade */}
      {step === "difficulty" && (
        <DifficultySelection onDifficultySelect={handleDifficultySelect} />
      )}

      {/* Tela de seleção de sala */}
      {step === "room" && <RoomSelection onRoomSelect={handleRoomSelect} />}

      {/* Tela do jogo */}
      {step === "game" && (
        <Game
          selectedAvatar={playerData.avatar}
          nickname={playerData.nickname}
          roomName={playerData.roomName}
          difficulty={difficulty} // Passando a dificuldade escolhida para o jogo
          onGameOver={handleGameOver} // Chama a função quando o jogo termina
        />
      )}

      {/* Tela de Game Over */}
      {step === "gameover" && <GameOver onReturnToRoom={handleGameOver} />}
    </div>
  );
};

export default App;
