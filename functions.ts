
import { iconMap,debugMap } from './game-rules-and-styles';
import { generateBoard } from './generate-board';
import type{Cell, Row, IndexedReference, PromptxOption, ShipSize} from './types';
import {createPrompt, createSelection} from 'bun-promptx';

/**
 * Selects the difficulty level for the game.
 * @returns The index of the selected difficulty level.
 */
export const selectDifficulty =  ():number => {
    const { selectedIndex } = createSelection([
    {text: '3x3', description: "Easy Mode"},
    {text: '4x4', description: "Medium Mode"},
    {text: '5x5', description: "Hard Mode"},
    {text: '6x6', description: "Expert Mode"}
  ],{
    headerText: "Select the size of the board",
    perPage: 3,
    footerText: "Use arrow keys to navigate and enter to select."
  });

  if (selectedIndex === null || selectedIndex === undefined) {
    throw new Error("No difficulty was selected.");
  }
  return selectedIndex;
}

/**
 * 
 * @param debug current variable for debugging preference
 * @param useTextforShots current variable for fire-mode preference
 * 
 * utility to change preference of firing style or enable debugging
 */
export const changeSettings = (debug:boolean=false, firingMode:boolean=false):boolean[]=>{

  let {selectedIndex} = createSelection([{text: "Yes", description:"Change Settings"},{text: "No",description: "Skip"}]);
  if(selectedIndex === 0){
    debug = enableDebug();
    firingMode = changeFiringMode();
  }
  if(!debug||!firingMode){
  debug = false;
  firingMode = false;
}
  return [debug,firingMode];
}

/**
 * 
 * @returns boolean
 * 
 * prompts the user to select whether they want to enable debugging
 */
export const enableDebug = ():boolean =>{
  const options:PromptxOption[] = [
    {text: "Enable Debugging", desciption:"Show ships before hitting"},
    {text: "Disable Debugging", desciption: "The way it's meant to be"}
  ];
  const{selectedIndex} = createSelection(options);
  return selectedIndex === 0;
}

/**
 * 
 * @returns boolean
 * 
 *  if true: Text-mode is enabled
 *  if false: Select-mode is enabled
 */
export const changeFiringMode = ():boolean =>{
  const options:PromptxOption[] = [
    {text: "Text Input", desciption: "Use text input for entering coordinates"},
    {text: "Selection Input", desciption:"Use the arrow keys to select coordinates from a list"}
  ];
  console.log("What firing mode would you like to use?");
  const {selectedIndex} = createSelection(options);
  return selectedIndex === 0;
}

/**
 * Prints the game board.
 * @param board The current game board.
 * @param attempts The number of attempts made so far.
 * @param debug Whether to show debug information for grading purposes.
 * This prints the board in a table to the console in a readable format.
 */
export const printBoard = (board: Row[], attempts: number, debug: boolean) => {
  let output: { [key: string]: string[] } = {};
  !debug?console.clear():console.log("\n\n");
  console.log(`       -Turns: ${attempts}-\n`,iconMap["help"]);
  if(debug){console.log(debugMap["debug info"])};
  for (const row of board) {
    output[row.name] = row.cells?.map(cell => {
      if (cell.hit) {
        return iconMap[cell.type];
      } else if(debug){
        return debugMap[cell.type];
      }else{
        return iconMap["blank"];
      }
    }) ?? [];
  }
  console.table(output);
}

/**
 * Prints out "Battleship" in text art font
 */
export const printStartMessage = ()=>{
  const message = ` ______   _______ __________________ _        _______  _______          _________ _______ 
(  ___ \\ (  ___  )\\__   __/\\__   __/( \\      (  ____ \\(  ____ \\|\\     /|\\__   __/(  ____ )
| (   ) )| (   ) |   ) (      ) (   | (      | (    \\/| (    \\/| )   ( |   ) (   | (    )|
| (__/ / | (___) |   | |      | |   | |      | (__    | (_____ | (___) |   | |   | (____)|
|  __ (  |  ___  |   | |      | |   | |      |  __)   (_____  )|  ___  |   | |   |  _____)
| (  \\ \\ | (   ) |   | |      | |   | |      | (            ) || (   ) |   | |   | (      
| )___) )| )   ( |   | |      | |   | (____/\\| (____/\\/\\____) || )   ( |___) (___| )      
|/ \\___/ |/     \\|   )_(      )_(   (_______/(_______/\\_______)|/     \\|\\_______/|/       
                                                                                          `;
  console.log("\x1b[38;5;55m\n",message,"\x1b[0m")
};

/**
 * 
 * @param attempts number of attempts during game
 * 
 * Prints a "you win" text art message
 */
export const printWin = (attempts: number = 0, totalShips: number=0)=>{
  const accuracy = parseInt(((totalShips/attempts)*100).toFixed(1));
  const winnerWinner:string = `
===============================================================
          _______                     _________ _       
|\\     /|(  ___  )|\\     /|  |\\     /|\\__   __/( (    /|
( \\   / )| (   ) || )   ( |  | )   ( |   ) (   |  \\  ( |
 \\ (_) / | |   | || |   | |  | | _ | |   | |   |   \\ | |
  \\   /  | |   | || |   | |  | |( )| |   | |   | (\\ \\) |
   ) (   | |   | || |   | |  | || || |   | |   | | \\   |
   | |   | (___) || (___) |  | () () |___) (___| )  \\  |
   \\_/   (_______)(_______)  (_______)\\_______/|/    )_)
                                                        
===============================================================
You have destroyed all battleships with ${attempts} shots! 
Your accuracy was ${accuracy}%.`;
console.clear();
console.log("\n \x1b[38;5;35m",winnerWinner,"\x1b[0m");
if(accuracy<60){
  console.log("Need to work on that aim though...");
}
};

/**
 * 
 * @param debug whether to show the ship locations for debugging purposes
 * 
 * this takes other helper functions to start a game that allows the user
 * to play Battleship. Has function to choose the size of the board, and 
 * randomly populates ships onto the board based on the size. Keeps track
 * of how many shots are fired as a scoring mechanism.
 */
export const playBattleship = (debug: boolean=false, useTextforShots:boolean=false) => {
  console.log("Welcome to Battleship!");
  const gameBoard: Row[] =  generateBoard(debug);
  let numShipsLeft = getNumOfShips(gameBoard);
  const totalShips = numShipsLeft;
  let attempts = 0;
  while(numShipsLeft>0){
    printBoard(gameBoard, attempts, debug);
    const lastShot = useTextforShots?fireShotTextually(gameBoard):fireShot(gameBoard);
    if(lastShot !="empty"){
      numShipsLeft--;
    };
    attempts++;
  }
  printWin(attempts,totalShips);
  
}

/**
 *
 * @param board the gameboard being used for current game
 * @returns an array of options for a user to select as a target and their reference to that target on the board
 */

export const generateOptions = (board: Row[]): IndexedReference => {
  let optionArr: { text: string; desciption: string; }[] = [];
  let references: { [key: number]: Cell; } = {};
  let index = 0;
  for (let rows of board) {
    let letter = rows.name;
    let rowIndex = 0;
    for (let cell of rows.cells) {
      if (!cell.hit) {
        optionArr.push({ text: `${letter}${rowIndex}`, desciption: `Fire` });
        references[index] = cell;
        index++;
      }
      rowIndex++;
    }
  }
  return [optionArr, references];
};

/**
 *
 * @param board the gameboard used for current game.
 *
 * a selected cell from the board has its "hit" property updated to true
 */
export const fireShot = (board: Row[]) => {
  const indexRef: IndexedReference = generateOptions(board);
  const [optionArr, references] = indexRef;
  console.log("Enter coordinates for artillery strike.");
  const { selectedIndex } = createSelection(optionArr);
  if (selectedIndex !== null && references?.[selectedIndex]) {
    let current = references[selectedIndex];
    if ('hit' in current) {
      current.hit = true;
      return current.type;
    }
  }

};

/**
 * 
 * @param board The game board
 * 
 * This lets the player fire a shot based on text input instead of an arrow
 * key selection, which was part of the assignment
 */
export const fireShotTextually = (board: Row[]):"small"|"large"|"empty" => {
  const indexRef: IndexedReference = generateOptions(board);
  const [optionArr, references] = indexRef;
  let cell: Cell | undefined = undefined;
  let isValidCoords: boolean = false;
  while (!isValidCoords) {
    console.log("Enter coordinates for artillery strike, i.e. 'A0'.");
    let { value } = createPrompt("Coordinates:");
    let validInputs = optionArr.map((item) => item.text);
    if (typeof value === "string") {
      value = value.toUpperCase().trim();
      isValidCoords = validInputs.includes(value);
    }
    if (!isValidCoords) {
      console.log(`"${value ?? ""}" is not a valid input. Try again.`);
    } else {
      const index = validInputs.indexOf(value as string);
      cell = references[index];
      if (!cell) {
        throw new Error(`Cell at index ${index} is undefined.`);
      }
      cell.hit = true;
    }
  }
  if (!cell) {
    throw new Error("No valid cell was selected.");
  }
  return cell.type;
}

/**
 *
 * @param board the game board
 * @param xVal X coordinate of the cell
 * @param yVal Y coordinate of the cell
 * @returns reference to the cell at selected coordinates
 */

export const getCellAt = (board: Row[], xVal: number, yVal: number): Cell => {
  const row = board[yVal];
  if (!row) {
    throw new Error(`Row at index ${yVal} is undefined.`);
  }
  const cell = row.cells[xVal];
  if (!cell) {
    throw new Error(`Cell at position (${xVal}, ${yVal}) is undefined.`);
  }
  return cell;
};

/**
 * Counts the total number of ship cells on the board.
 * @param gameBoard The current game board.
 * 
 * @returns The number of ship cells.
 */
function getNumOfShips(gameBoard: Row[]): number {
  let count = 0;
  for (const row of gameBoard) {
    for (const cell of row.cells) {
      if (cell.type != 'empty') {
        count++;
      }
    }
  }
  return count;
}

/**
 * 
 * @returns Boolean
 * 
 * Lets the user decide to exit the game based on a prompt
 */
export function endGame(): boolean {
  const answer = createSelection([{ text: "yes", description: "Play Again" }, { text: "no", description: "Exit" }], { headerText: "Do you want to play again?", perPage: 2, footerText: "Please don't go..." });
  if (answer.selectedIndex === 1) {
    console.log("Thanks for playing!");
    return false;
  }
  return true;
}