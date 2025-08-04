/**
 * Object mapping cell types to their corresponding icons.
 */
export const iconMap = {
  "help": "| ⚪ - ?|| 🔵 - Large Ship|| 🟠 - Small Ship|| ❌ - Missed Shot|",
  "large": "🔵",
  "small": "🟠",
  "empty": "❌",
  "blank": "⚪"
};
export const debugMap = {
  "debug info": "Debug: |⏹️ - Large Ship Unhit|🟧 - Small Ship Unhit|",
  "large": "⏹️",
  "small": "🟧",
  "empty": "⚪"
}

type GameRule = {size:number,numSmallShips:number,numLargeShips:number};
export const gameRules:GameRule[] = [
  {
    size: 3,
    numSmallShips: 1,
    numLargeShips: 1
  },
  {
    size: 4,
    numSmallShips: 2,
    numLargeShips: 1
  },
  {
    size: 5,
    numSmallShips: 2,
    numLargeShips: 2
  },
  {
    size: 6,
    numSmallShips: 3,
    numLargeShips: 2
  },
  {
    size: 7,
    numSmallShips: 4,
    numLargeShips: 3
  }
];

