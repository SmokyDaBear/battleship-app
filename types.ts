/**
 * An individual Cell on the board
 */
export type Cell = {
  type: "small" | "large" | "empty",
  hit: boolean
}

/**
 * A named row of cells
 */
export type Row = {
  name: string,
  cells: Cell[]
}

/**
 * Provides only two options for ship size
 */
export type ShipSize = "small" | "large";

/**
 * Type is used for the fireShot method. It helps make the linter stop yelling at me...
 */
export type IndexedReference = [PromptxOption[], { [key: number]: Cell; }];

/**
 * Type of object in a valid format for the Promptx bun package
 */
export type PromptxOption = { text: string; desciption: string; };

/**
 * This type is for the ship creation during the board building phase
 */
export type ShipProps = {
  xVal: number;
  yVal: number;
  isVertical: boolean;
  shipLength: 2 | 3;
};

