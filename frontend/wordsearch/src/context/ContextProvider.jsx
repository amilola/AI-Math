'use client'
import {useState} from "react";
import { GridContext } from "@/context/GridContext";
import { GameContext } from "@/context/GameContext";

export const GridContextProvider = ({children}) => {
    const [searchWords, setSearchWords] = useState([])
    const [grid, setGrid] = useState([])
    const [answers, setAnswers] = useState([])
    const [buttonGrid, setButtonGrid] = useState([])

    const value = {
        searchWords,
        setSearchWords,
        setGrid,
        grid,
        answers,
        setAnswers,
        buttonGrid,
        setButtonGrid
    }

    return <GridContext.Provider value={value}>{children}</GridContext.Provider>
}

export const GameContextProvider = ({ children }) => {
    const [currentSelection, setCurrentSelection] = useState([])
    const [isMouseDown, setIsMouseDown] = useState(false)
    const [isNewGame, setIsNewGame] = useState(true)
    const [isGameData, setIsGameData] = useState(false)
	const [foundWords, setFoundWords] = useState([])
    const [mode, setMode] = useState('8')
	const [onSelection, setOnSelection] = useState(false)
	const [initRow, setInitRow] = useState(null)
	const [initCol, setInitCol] = useState(null)
	const [direction, setDirection] = useState('')
	const [prevRow, setPrevRow] = useState('')
	const [prevCol, setPrevCol] = useState('')
	
	function changePrevRow(val) {
		setPrevRow(val)
	}

	function changePrevCol(val) {
		setPrevCol(val)
	}

    function addToCurrentSelection(selection){
        setCurrentSelection(prevState => [...prevState, selection])
    }

    function resetCurrentSelection(){
        setCurrentSelection([])
    }

	function changeInitRow(val){
		setInitRow(val)
	}

	function changeInitCol(val) {
		setInitCol(val)
	}



    const value = {
        currentSelection,
        isNewGame,
        setIsNewGame,
        isGameData,
        setIsGameData,
        isMouseDown,
        setIsMouseDown,
        foundWords,
        setFoundWords,
        addToCurrentSelection,
        resetCurrentSelection,
        mode,
        setMode,
		direction,
		setDirection,
		onSelection,
		setOnSelection,
		initCol,
		initRow,
		changeInitCol,
		changeInitRow,
		prevCol,
		prevRow,
		changePrevRow,
		changePrevCol
    }

    return <GameContext.Provider value={value}>{ children }</GameContext.Provider>
}
