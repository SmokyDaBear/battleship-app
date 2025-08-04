import { changeFiringMode, changeSettings, enableDebug, endGame, playBattleship, printStartMessage } from "./functions";

printStartMessage();
let[debug,useTextforShots]:boolean[] = changeSettings();
let keepPlaying:boolean = true;
while(keepPlaying){
    playBattleship(debug,useTextforShots);
    keepPlaying = endGame();
    if(keepPlaying){
      [debug,useTextforShots] = changeSettings(debug,useTextforShots);
    }
}

