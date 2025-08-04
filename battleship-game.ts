import { changeFiringMode, changeSettings, enableDebug, endGame, playBattleship, printStartMessage } from "./functions";

printStartMessage();
let debug = enableDebug();
let useTextforShots = changeFiringMode();
let keepPlaying:boolean = true;
while(keepPlaying){
    playBattleship(debug,useTextforShots);
    keepPlaying = endGame();
    if(keepPlaying){
      changeSettings(debug,useTextforShots);
    }
}

