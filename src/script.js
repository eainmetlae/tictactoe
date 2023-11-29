"use strict";

console.log("in js");

const containerEl = document.querySelector(".container");
let currentPlayer = "P";

const playerMove = {
  player: "player",
  dgGroup: [[], []],
  hrGroup: [[], [], []],
  vtGroup: [[], [], []],
};

const compMove = {
  player: "computer",
  dgGroup: [[], []],
  hrGroup: [[], [], []],
  vtGroup: [[], [], []],
};

const updatePlayerMove = function (move, whoseMove) {
  const [a, b] = move.split(",");
  const numA = Number.parseInt(a);
  const numB = Number.parseInt(b);

  if (numA === numB) {
    //0,0 1,1, 2,2
    whoseMove.dgGroup[0].push(move);
    if (numA === 1) whoseMove.dgGroup[1].push(move);
  }
  if (numA + numB === 2 && numA !== 1) {
    whoseMove.dgGroup[1].push(move);
  }
  whoseMove.vtGroup[a].push(move);
  whoseMove.hrGroup[b].push(move);
};

const countMoves = function () {
  const circleElements = document.querySelectorAll(".circle-big");
  const crossElements = document.querySelectorAll(".cross-big");
  return { C: circleElements?.length, P: crossElements?.length };
};

const getMoves = function () {
  let finalResult;
  if (currentPlayer === "P")
    finalResult = [
      ...playerMove.dgGroup,
      ...playerMove.hrGroup,
      ...playerMove.vtGroup,
    ];
  else
    finalResult = [
      ...compMove.dgGroup,
      ...compMove.hrGroup,
      ...compMove.vtGroup,
    ];
  return finalResult;
};

const updateWinningTrack = function () {
  const finalResult = getMoves();
  const winningPath = finalResult.find((item) => item.length === 3);
  console.log(winningPath);
  winningPath.forEach((item) => {
    const el = document.querySelector(`[data-val="${item}"]`);
    el.style.backgroundColor = "#8ce99a";
  });
};

const checkWinner = function () {
  //possible outcomes: winner, '', 'draw'
  const { C: computer, P: player } = countMoves();
  const totalMoves = computer + player;

  const maxMove = Math.max(computer, player);
  if (maxMove < 3) return "";

  const finalResult = getMoves();

  console.log(finalResult);
  const winningMove = finalResult.some((item) => item.length === 3);
  if (winningMove) return currentPlayer;

  if (totalMoves === 9) return "draw";
  return "";
};

containerEl.addEventListener("click", function (e) {
  const clickedEl = e.target.closest(".square");
  // 1) check if the cell is already occupied
  if (clickedEl.children.length > 0) return;

  // 2) Mark cell
  const moveMarkup = `<div class="${
    currentPlayer === "P" ? "cross-big" : "circle-big"
  }"></div>`;
  clickedEl.insertAdjacentHTML("afterbegin", moveMarkup);

  // 3) Update player move
  if (currentPlayer === "P")
    updatePlayerMove(clickedEl.dataset.val, playerMove);
  else updatePlayerMove(clickedEl.dataset.val, compMove);

  // 4) For every move, check if there is winner.
  const winner = checkWinner();
  if (winner === "")
    currentPlayer === "P" ? (currentPlayer = "C") : (currentPlayer = "P");
  else {
    if (winner === "draw") alert("It's a draw!");
    else {
      updateWinningTrack();
      alert(`${winner} won!!`);
    }
    setTimeout(() => {
      location.reload();
    }, 5000);
  }
});
