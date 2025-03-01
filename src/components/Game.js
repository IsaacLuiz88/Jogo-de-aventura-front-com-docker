import { useState, useEffect, useRef, useCallback } from "react";
import socket, { entrarNaSala } from "../socket";
import "./Game.css";

// Função para criar um nó de lista encadeada
class Node {
  constructor(value, next = null) {
    this.value = value;
    this.next = next;
  }
}

// Lista encadeada para gerenciar os blocos
class LinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
  }

  add(value) {
    const newNode = new Node(value);
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      this.tail.next = newNode;
      this.tail = newNode;
    }
  }

  removeFirst() {
    if (this.head) {
      this.head = this.head.next;
    }
  }

  toArray() {
    const array = [];
    let current = this.head;
    while (current) {
      array.push(current.value);
      current = current.next;
    }
    return array;
  }
}

const Game = ({ selectedAvatar, nickname, roomName, difficulty }) => {
  // Estados do Jogo
  const [blocks, setBlocks] = useState(new LinkedList());
  const [playerPosition, setPlayerPosition] = useState({ x: 100, y: 200 });
  const [score, setScore] = useState(0);
  const [life, setLife] = useState(difficulty === "hard" ? 1 : difficulty === "medium" ? 3 : 5);
  const [energy, setEnergy] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isJumping, setIsJumping] = useState(false);
  const [isSuperJumping, setIsSuperJumping] = useState(false);
  const [jumpedBlocks, setJumpedBlocks] = useState(new Set());
  const [totalJumpedBlocks, setTotalJumpedBlocks] = useState(0);
  const [totalBombasPuladas, setTotalBombasPuladas] = useState(0);
  const [totalBombasExplodidas, setTotalBombasExplodidas] = useState(0);
  const [totalEnergiaCapturada, setTotalEnergiaCapturada] = useState(0);
  const gameContainerRef = useRef(null);
  const [background, setBackground] = useState("");

  // Estados para o chat multiplayer
  const [mensagem, setMensagem] = useState("");
  const [mensagens, setMensagens] = useState([]);
  const [jogadores, setJogadores] = useState([]);

  // Efeito para configurar o fundo de acordo com a dificuldade
  useEffect(() => {
    switch (difficulty) {
      case "easy":
        setBackground("url('./easy-background.png')");
        break;
      case "medium":
        setBackground("url('./medium-background.png')");
        break;
      case "hard":
        setBackground("url('./hard-background.png')");
        break;
      default:
        setBackground("url('./default-background.png')");
    }
  }, [difficulty]);

  // Conectar WebSocket para o chat multiplayer
  useEffect(() => {
    socket.on("mensagem", (novaMensagem) => {
      setMensagens((prev) => [...prev, novaMensagem]);
    });
    socket.on("atualizarJogadores", (listaJogadores) => {
      setJogadores(listaJogadores);
    });

    // Limpeza do efeito para remover os listeners
    return () => {
      socket.off("mensagem");
      socket.off("atualizarJogadores");
    };
  }, []);

  // Função para enviar uma mensagem no chat
  const enviarMensagem = () => {
    if (mensagem.trim() !== "") {
      socket.emit("mensagem", mensagem); // Envia a mensagem para o servidor
      setMensagem(""); // Limpa o campo de entrada após enviar
    }
  };

  // Função para entrar na sala multiplayer
  useEffect(() => {
    if (nickname && roomName) {
      entrarNaSala(roomName, nickname); // Envia o nome e a sala para o servidor
    }
  }, [nickname, roomName]);

  // Gerar blocos aleatórios para o jogo
  const generateBlock = useCallback(() => {
    const blockTypes = ["normal", "explosive", "energy", "bonus"];
    const randomType = blockTypes[Math.floor(Math.random() * blockTypes.length)];

    return {
      type: randomType,
      x: window.innerWidth - 80,
      y: 150 + Math.floor(Math.random() * 50), // Posição Y dos blocos
    };
  }, []);

  // Atualizar a posição dos blocos
  const updateBlocks = useCallback(() => {
    const updatedBlocks = new LinkedList();
    let current = blocks.head;
    let lastBlockX = -1;
    const blockSpeed = difficulty === "hard" ? 20 : difficulty === "medium" ? 15 : 10;

    while (current) {
      const block = current.value;
      block.x -= blockSpeed; // Move os blocos para a esquerda
      if (block.x > -80) {
        updatedBlocks.add(block);
        lastBlockX = block.x;
      }
      current = current.next;
    }

    // Adicionar novos blocos aleatórios
    if (lastBlockX === -1 || lastBlockX < window.innerWidth - 300) {
      updatedBlocks.add(generateBlock());
    }

    setBlocks(updatedBlocks);
  }, [blocks, generateBlock, difficulty]);

  // Lógica de pulo da Milta (personagem)
  const handleJump = useCallback(() => {
    if (isJumping || isSuperJumping) return; // Impede múltiplos saltos

    if (energy >= 3) {
      // Super salto
      setIsSuperJumping(true);
      setEnergy(0);

      const jumpHeight = 400;
      const jumpDuration = 3500;

      setPlayerPosition((prev) => ({ ...prev, y: playerPosition.y - jumpHeight }));

      setTimeout(() => {
        setPlayerPosition((prev) => ({ ...prev, y: 200 }));
        setIsSuperJumping(false);
      }, jumpDuration);
    } else {
      // Salto normal
      setIsJumping(true);

      const jumpHeight = 300;
      const jumpDuration = 1250;

      setPlayerPosition((prev) => ({ ...prev, y: playerPosition.y - jumpHeight }));

      setTimeout(() => {
        setPlayerPosition((prev) => ({ ...prev, y: 200 }));
        setIsJumping(false);
      }, jumpDuration);
    }
    setTotalJumpedBlocks((prev) => prev + 1);
  }, [playerPosition, isJumping, isSuperJumping, energy]);

  // Verificar colisões entre os blocos e o personagem
  const checkCollisions = useCallback(() => {
    let current = blocks.head;
    const newJumpedBlocks = new Set(jumpedBlocks);

    while (current) {
      const block = current.value;

      // Verifica se o bloco está na mesma faixa horizontal e na faixa de altura do personagem
      const isInHorizontalRange = block.x < playerPosition.x + 70 && block.x + 70 > playerPosition.x;
      const isAboveMilta = block.y < playerPosition.y + 70 && block.y + 70 > playerPosition.y;

      if (isInHorizontalRange && isAboveMilta) {
        if (!newJumpedBlocks.has(block)) {
          newJumpedBlocks.add(block);

          // Lógica de colisão com os blocos
          if (block.type === "explosive") {
            if (!isSuperJumping) {
              setLife((prev) => prev - 1);
              if (life <= 1) setGameOver(true);
            }
            setTotalBombasExplodidas((prev) => prev + 1);
          } else if (block.type === "energy") {
            setEnergy((prev) => Math.min(prev + 1, 3));
            setTotalEnergiaCapturada((prev) => prev + 1);
          } else if (block.type === "bonus") {
            setScore((prev) => prev + 10);
          } else {
            setScore((prev) => prev + 1);
          }
        }
      } else if (block.type === "explosive" && block.x < playerPosition.x) {
        setTotalBombasPuladas((prev) => prev + 1);
      } else if (block.type !== "explosive" && block.x < playerPosition.x) {
        setTotalJumpedBlocks((prev) => prev + 1);
      }

      current = current.next;
    }

    setJumpedBlocks(newJumpedBlocks);
  }, [blocks, playerPosition, isSuperJumping, life, jumpedBlocks]);

  // Efeito para atualizar os blocos e verificar colisões
  useEffect(() => {
    if (gameOver) return;

    const gameInterval = setInterval(() => {
      updateBlocks();
      checkCollisions();
    }, 100);

    return () => clearInterval(gameInterval);
  }, [updateBlocks, checkCollisions, gameOver]);

  // Efeito para ouvir eventos de tecla para pular
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === "Space") {
        handleJump();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleJump]);

  // Exibição da tela de Game Over
  if (gameOver) {
    return (
      <div className="game-over">
        <h1>Game Over!</h1>
        <p>Score: <strong>{score}</strong></p>
        <p>Total Bricks Skipped: <strong>{totalJumpedBlocks}</strong></p>
        <p>Total Bombs Skipped: <strong>{totalBombasPuladas}</strong></p>
        <p>Total Bombs Exploded: <strong>{totalBombasExplodidas}</strong></p>
        <p>Total Energy Captured: <strong>{totalEnergiaCapturada}</strong></p>
        <p>Nickname: <strong>{nickname}</strong></p>
      </div>
    );
  }

  // Exibição do jogo e do chat
  return (
    <div className="game-container" ref={gameContainerRef} style={{ backgroundImage: background }}>
      <div className={`avatar game-avatar ${isJumping || isSuperJumping ? 'jumping' : ''}`}>
        <img src={`/${selectedAvatar}.png`} alt="Milta" />
      </div>
      <div className="status">
        <div className="life">❤️ {life}</div>
        <div className="energy">⚡ {energy}</div>
        <div className="score">Score: {score}</div>
        {/* Chat Multiplayer */}
        <div className="chat">
          <h1>Sala: {roomName}</h1>
          <h2>Jogador: {nickname}</h2>
          <ul>
            {mensagens.map((msg, index) => (
              <li key={index}>{msg}</li>
            ))}
          </ul>
          <input
            type="text"
            value={mensagem}
            onChange={(e) => setMensagem(e.target.value)}
            placeholder="Digite uma mensagem..."
          />
          <button onClick={enviarMensagem}>Enviar</button>
        </div>
      </div>
      <div className="blocks-container">
        {blocks.toArray().map((block, index) => (
          <div
            key={index}
            className="block"
            style={{ left: block.x, position: "absolute", bottom: 0 }}
          >
            <img src={`./${block.type}-block.png`} alt={block.type} />
          </div>
        ))}
      </div>


    </div>
  );
};

export default Game;
