import { selectDifficulty,getCellAt, printBoard } from "./functions";
import { gameRules } from "./game-rules-and-styles";
import type { Row, Cell, ShipProps, ShipSize } from "./types";


/**
 *
 * @param boardLength the size of the board
 * @param shipSize the size of the ship to be placed
 * @returns an object containing a random index within the board, whether the ship will be vertical(if possible) and the length of the ship dependent on its size
 *
 */
const randomize = (board: Row[], shipSize: string,debug:boolean = false):ShipProps => {
  let invalid = true;
  const boardLength: number = board.length;
  let answer: ShipProps = { xVal: 0, yVal: 0, isVertical: false, shipLength: 2 };
  while (invalid) {
    const xVal = Math.floor(Math.random() * boardLength);
    const yVal = Math.floor(Math.random() * boardLength);
    const isVertical: boolean = xVal % 2 === 0;
    const shipLength = shipSize === "large" ? 3 : 2;
    if(debug){
      console.log(`Attempting to place ${shipSize} ship ${isVertical?"vertically":"horizontally"} at ${xVal},${yVal }`);
    };
    const props: ShipProps = { xVal, yVal, isVertical, shipLength };
    if (isVertical) {
      invalid = (yVal + shipLength) > boardLength;
    } else {
      invalid = (xVal + shipLength) > boardLength;
    }
    if (!invalid) {
      invalid = !checkIfEmpty(xVal, yVal, board, shipLength, isVertical,debug);
      if(debug){
        invalid ? console.log(`Coordinates:[${xVal},${yVal}] would go off the board!`) : console.log(`Coordinates:[${xVal},${yVal}] is OK.`);
    };
  }
    answer = props;

  }
  return answer;
};

/**
 * Adds a ship to the game board ensuring it fits within the board boundaries and doesn't overlap with other ships.
 * @param board The game board.
 * @param shipSize The size of the ship to add ("small" or "large").
 */
const addShip = (board: Row[], shipSize: ShipSize,debug:boolean=false) => {
  let { xVal, yVal, isVertical, shipLength }: ShipProps = randomize(board, shipSize,debug);
  while (shipLength > 0) {
    let curCell: Cell = getCellAt(board, xVal, yVal);
    curCell.type = shipSize;
    shipLength--;
    if (isVertical) {
      yVal++;
    } else {
      xVal++;
    }
  }


};

/**
 *
 * @param xValue Horizontal coordinate of the spot to check
 * @param yValue Vertical coordinate of the spot to check
 * @param board The game board to test the spots of
 * @param shipLength The length of the ship to test for
 * @param isVertical Whether to check adjacent X or Y values
 * @returns Returns a boolean of whether the coordinate is a good empty spot to anchor a ship
 */
const checkIfEmpty = (xValue: number, yValue: number, board: Row[], shipLength: number, isVertical: boolean,debug:boolean=false): boolean => {
  let spotsAreEmpty = true;
  let xVal = xValue;
  let yVal = yValue;
  let i = shipLength;
  while (i > 0 && spotsAreEmpty) {
    let curCell: Cell = getCellAt(board, xVal, yVal);
    if (curCell.type != "empty") {
      spotsAreEmpty = false;
      break;
    }
    if (isVertical) {
      yVal++;
    } else {
      xVal++;
    }
    i--;
  }
  if(debug){
    console.log(`Spot empty at ${xVal},${yVal}: ${spotsAreEmpty}`);
  }
  return spotsAreEmpty;
};

/**
 *
 * @param board The game board
 * @param smallShips The number of small ships dependent on size
 * @param largeShips The number of large ships dependent on size
 * Modifies the board and adds ships of different sizes
 */
const populateShips = (board: Row[], smallShips: number, largeShips: number,debug:boolean=false) => {
  if(debug){
    console.log("Populating ships onto board...");
    printBoard(board,0,debug);
  };
  while (largeShips > 0) {
    if(debug){
      console.log("Adding a large ship...");
    }
    addShip(board, "large",debug);
    largeShips--;
  }
  while (smallShips > 0) {
    if(debug){
      console.log("Adding a small ship...");
    };
    addShip(board, "small",debug);
    smallShips--;
  }
  return board;
};


/**
 * @returns A new game board based on the selected difficulty level or board size.
 */
export const generateBoard = (debug:boolean=false) => {
  let newBoard: Row[] = [];
  const difficulty: number = selectDifficulty();

  const rule = gameRules[difficulty];
  if (!rule) {
    throw new Error(`Invalid difficulty: ${difficulty}`);
  }
  const { size, numSmallShips, numLargeShips } = rule;
  for (let i = 0; i < size; i++) {
    let rowCells: Cell[] = [];
    for (let j = 0; j < size; j++) {
      rowCells.push({ type: "empty", hit: false });
    }
    newBoard.push({ name: String.fromCharCode(65 + i), cells: rowCells });
  }
  populateShips(newBoard, numSmallShips, numLargeShips,debug);

  return newBoard;
}; 
