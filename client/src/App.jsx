import React, { useEffect, useState } from 'react';
import './index.css';
import io from 'socket.io-client';

const socket = io('https://tic-tac-toe-socket-io-rc9f.onrender.com');

const App = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState('');
  const [winner, setWinner] = useState(null);
  const [buttonColor1, setButtonColor1] = useState('bg-white');
  const [buttonColor2, setButtonColor2] = useState('bg-white');
  const [isButtonDisabled1, setIsButtonDisabled1] = useState(false);
  const [isButtonDisabled2, setIsButtonDisabled2] = useState(false);
  const [disvalue, setDisValue] = useState(false);

  const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const handleClick = (index) => {
    setDisValue(true);
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    // console.log(newBoard);
    setBoard(newBoard);
    
    const newWinner = checkWinner(newBoard);
    if (newWinner) {
      setWinner(newWinner);
    }
    else {
        setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
      }
      const oppValue = disvalue;
      socket.emit('send-message', {newBoard , newWinner , currentPlayer , oppValue});
  };

  const checkWinner = (board) => {
    for (let [a, b, c] of winningConditions) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }

    if (!board.includes(null)) {
      return 'Draw';
    }

    return null;
  };

  const handleTurnChangeToX = () => {
    setButtonColor1('bg-red-500');
    setIsButtonDisabled2(true);
    setCurrentPlayer('X');


  }
  const handleTurnChangeToO = () => {
    setButtonColor2('bg-red-500');
    setIsButtonDisabled1(true);
    setCurrentPlayer('O');

  }

const handleRestart = () => {
  handleRestartDetails();

};

  const handleRestartDetails = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer('');
    setWinner(null);
    setIsButtonDisabled1(false);
    setIsButtonDisabled2(false);
    setButtonColor1('bg-white');
    setButtonColor2('bg-white');
    setDisValue(false);
  };



  useEffect(() => {
    socket.on('room-full', () => {
      alert('The room is full. Please try again later.');}
    )

    socket.on("receive-message" , (data) => {
      // console.log(data);
      setBoard(data.newBoard);
      if(data.newWinner){
        setWinner(data.newWinner);
      }
    })

    socket.on("receive-message2" , (data) => {
      setCurrentPlayer(data.currentPlayer === 'O' ? 'X' : 'O');
      setDisValue((data.oppValue));
    })
  },[socket])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 relative">

    <button className={`absolute border-2 border-black p-4 right-[7rem] top-3 ${buttonColor1} disabled:opacity-50 `} onClick={handleTurnChangeToX} disabled={isButtonDisabled1}>X turn</button>

    <button className={`absolute border-2 border-black p-4 right-[1rem] top-3 ${buttonColor2} disabled:opacity-50`} onClick={handleTurnChangeToO} disabled={isButtonDisabled2}>O turn</button>

      <h1 className="text-4xl font-bold mb-8">Tic-Tac-Toe</h1>
      <div className="grid grid-cols-3 gap-4 mb-4">
        {board.map((value, index) => (
          <div
            key={index}
            className={`flex items-center justify-center w-24 h-24 bg-white border-2 border-gray-800 text-4xl cursor-pointer ${disvalue ? 'pointer-events-none' : ''}`}
            onClick={() => handleClick(index)}
          >
            {value}
          </div>
        ))}
      </div>
      <div className="text-2xl mb-4">
        {winner ? (winner === 'Draw' ? 'It\'s a Draw!' : `Winner: ${winner}`) : `Next Player: ${currentPlayer}`}
      </div>
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
        onClick={handleRestart}
      >
        Restart Game
      </button>
    </div>
  );
};

export default App;
