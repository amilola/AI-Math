import {useGameContext} from "@/context/GameContext";
import {useEffect, useState} from "react";
import {useGridContext} from "@/context/GridContext";
import validateDirection from "@/lib/check_direction";

export const Box = ({letter}) => {
    const {addToCurrentSelection, currentSelection, isMouseDown, setIsMouseDown, resetCurrentSelection, setFoundWords, isNewGame, initRow, changeInitRow, initCol, changeInitCol, direction, setDirection, prevCol, prevRow, changePrevCol, changePrevRow} = useGameContext()
    const {searchWords, buttonGrid} = useGridContext()
	// const [currRow, setCurrRow] = useState(null)
	// const [currCol, setCurrCol] = useState(null)
	let currRow = null
	let currCol = null

	useEffect(() => {
		if(isMouseDown===false){
			currentSelection.forEach(button => {
                button.classList.remove('bg-[#2C80E2]')
                button.classList.remove('text-white')
                button.classList.add('bg-white')
            })	
		}

	}, [isMouseDown])

    function checkIfCurrentSelectionValid(){
        let selection = ''
		let isValid = false
        currentSelection.forEach((button, idx) => {
            selection += idx===0 ? button.innerText : button.innerText.toLowerCase()

        })
		searchWords.forEach(word => {
			if(word[0]===selection){
				isValid = true
			}
		})
        return {isValid, selection}
    }

    function showSelection(button) {
        // currentSelection.forEach(button => {
        //     button.classList.remove('bg-white')
        //     button.classList.add('bg-[#8E789D]')
        //     button.classList.add('text-white')
            
        // })

        button.classList.remove('bg-white')
        button.classList.add('bg-[#2C80E2]')
        button.classList.add('text-white')
    }

    function onCrossStart(event){
        // console.log(event.target.innerText)
        setIsMouseDown(true)
        // event.target.classList.add('bg-[#8E789D]')
        // event.target.classList.add('text-white')
        // event.target.classList.remove('bg-white')
		buttonGrid.forEach((r, idx) => {
			if(r.indexOf(event.target) !== -1){
				changeInitCol(r.indexOf(event.target))
				changeInitRow(idx)
				changePrevCol(r.indexOf(event.target))
				changePrevRow(idx)
			}
					
		})

        addToCurrentSelection(event.target)
		// onCross(event)
        showSelection(event.target)
    }

    function onCross(event){
		
		// console.log(event.ClientX)
		// Check if mouse is being pressed down
        if(isMouseDown){
				
			if(currentSelection.length >= 1){
				buttonGrid.forEach((r, idx) => {
					// if(currCol === null){
					// 	r.indexOf(event.target) === -1 ? null : setCurrCol(r.indexOf(event.target))
					// 	currCol === null ? null : setCurrRow(idx)
					// }
					if(r.indexOf(event.target) !== -1){
						console.log('Found the button')		
						currCol = r.indexOf(event.target)
						currRow = idx
						// setCurrCol(r.indexOf(event.target))
						// setCurrRow(idx)
					}		
				})

				// console.log(currCol !== null && currCol === initCol)

				if(direction.length === 0){
					if(currCol !== null && currCol === initCol){
						setDirection('Vertical')
					}
					else if(currCol !== null && currRow === initRow){
						setDirection('Horizontal')
					}
					else{
						setDirection('Diagonal')
					}	
				}
			}
			
			let validDirection = currRow !== null ?  validateDirection([initRow, initCol], [prevRow, prevCol], [currRow, currCol], direction) : null

			if(validDirection ||  currentSelection.length < 2){
								//console.log('Adding to current selection')
				// console.log([currRow, currCol])
				addToCurrentSelection(event.target); showSelection(event.target)
				changePrevCol(currCol)
				changePrevRow(currRow)

			}

        }
    }

    function onCrossEnd(){
		changeInitCol(null)
		changeInitRow(null)
		changePrevRow(null)
		changePrevCol(null)
		// setCurrCol(null)
		// setCurrRow(null)
		currCol = null
		currRow = null
		setDirection('')
        let selectionValid = checkIfCurrentSelectionValid()
		console.log(selectionValid)
        if(!selectionValid.isValid){
            currentSelection.forEach(button => {
                button.classList.remove('bg-[#2C80E2]')
                button.classList.remove('text-white')
                button.classList.add('bg-white')
                
            })

        }else{
            setFoundWords(prevState => [...prevState, selectionValid.selection])
        }
        setIsMouseDown(false)
        resetCurrentSelection()
    }

    return (
        <button className={`letter flex hover:border-[#2C80E2] bg-white hover:border-2 items-center justify-center p-1 m-1 text-black font-bold capitalize w-10 h-10 ${isNewGame ? 'bg-white text-black' : null}`}
                onMouseUp={(event) => onCrossEnd(event)}
                onMouseDown={(event) => onCrossStart(event)}
                onMouseEnter={(event) => onCross(event)}
                // onMouseLeave={(event) => onUnCross(event)}
        >
            {letter}
        </button>
    )
}
