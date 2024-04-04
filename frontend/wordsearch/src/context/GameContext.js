import {createContext, useContext} from "react";

export const GameContext = createContext({
    isMouseDown: false,
    isNewGame: false,
    setIsNewGame(){},
    setIsMouseDown() {},
    currentSelection: [],
    foundWords: [],
    setFoundWords(){},
    addToCurrentSelection(){},
    // removeFromCurrentSelection() {},
    resetCurrentSelection() {},
    mode: '',
    setMode() {},
	direction: '',
	setDirection() {},
	onSelection: false,
	setOnSelection() {},
	initRow: null,
	changeInitRow() {},
	initCol: null,
	changeInitCol() {},
	prevRow: null,
	changePrevRow() {},
	prevCol: null,
	changePrevCol() {}
})

export const useGameContext = () => useContext(GameContext)
