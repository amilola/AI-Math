'use client'

import Image from 'next/image'
import axiosRetry, {isNetworkError} from 'axios-retry';
import axios from "axios";
import {useGridContext} from "@/context/GridContext";
import {useEffect, useRef, useState} from "react";
import {ArrowPathIcon} from "@heroicons/react/24/outline";
import {useGameContext} from "@/context/GameContext";
import {Game} from "@/components/Game";

export default function Home() {
	const [increase, setIncrease] = useState(false)
	const [showModal, setShowModal] = useState(false)
	const [showLoading, setShowLoading] = useState(true)
    const selectRef = useRef(null)
	const menuRef = useRef(null)
    const {searchWords, setGrid, setSearchWords, setAnswers, answers, buttonGrid} = useGridContext()
    const {setFoundWords, resetCurrentSelection, setIsMouseDown, setIsNewGame, isNewGame, isGameData, setIsGameData, setMode} = useGameContext()

    function getNewGame(){
        let diff;
		try {
			if(selectRef.current.value.includes('kindergarten') || selectRef.current.value.includes('elementary')){
				diff = 'very-easy'
			}else if(selectRef.current.value.includes('mid')){
				diff = 'easy'
			}else if(selectRef.current.value.includes('high')){
				diff = 'hard'
			}else{
				diff = 'complex'
			}
			
		}catch{
			if(menuRef.current.value.includes('kindergarten') || menuRef.current.value.includes('elementary')){
				diff = 'very-easy'
			}else if(menuRef.current.value.includes('mid')){
				diff = 'easy'
			}else if(menuRef.current.value.includes('high')){
				diff = 'hard'
			}else{
				diff = 'complex'
			}
			
		}
		axiosRetry(axios, {
			retries: 3,
			retryDelay: axiosRetry.exponentialDelay, 
			retryCondition(error) {
				switch(error.response.status){
					case 404:
						return true
					case 403:
						return true
				}

				if(isNetworkError(error)){
					return true
				}
			},
			onRetry: (retryCount) => { console.log(`Retry attempt: ${retryCount}`) }
		})

        axios
            .get(`http://localhost:8000/new-game?mode=${diff}`)
            .then(response => {
                setGrid(response.data.grid)
                let search_words = response.data.search_words.length > 10 ? response.data.search_words.slice(0, 11) : response.data.search_words
                console.log(search_words)
                setSearchWords(search_words)
                let answers = response.data.search_words.length > 10 ? Object.fromEntries(Object.entries(response.data.answers).filter(([key]) => searchWords.includes(key))) : response.data.answers
                setAnswers(answers)
            })
            .finally(() => {
                setIsNewGame(true)
                setFoundWords([])
                resetCurrentSelection()
                setIsMouseDown(false)
                setIsGameData(true)
            })
            .catch(error => {
				console.log(`Failed to connect after 3 retries`)
                console.log(error)
                setIsGameData(false)
				setShowModal(true)
            })
    }


    useEffect(() => {
        getNewGame()
        setIsNewGame(false)
    }, [])

	useEffect(() => {}, [showLoading])

    const onSelectAge = (event) => {
        if (event.target.value === "kindergarten" || event.target.value === "elementary") {
            createNewGame()
            setMode('10')
			setIncrease(false)
        }
        else if (event.target.value === "mid-school") {
            createNewGame()
            setMode('10')
			setIncrease(false)
        }
        else if (event.target.value === "high-school") {
            createNewGame('hard')
            setMode('12')
			setIncrease(true)
        } else {
            createNewGame('complex')
            setMode('12')
			setIncrease(true)
        }
    }
	
	function showMenu() {
		return (
			<div className='flex justify-center items-end gap-5'>
				<button className='bg-green-600 text-white p-2 min-w-[150px] h-14' onClick={createNewGame}>New Game</button>
				<div className='flex flex-col gap-2'>
					<label className={'font-bold'} htmlFor={'difficulty'}>Select an age group</label>
					<select ref={menuRef} className={'bg-green-300 h-10 p-2'} id={'difficulty'} onInput={(event) => onSelectAge(event)} value={'kindergarten'}>
						<option value={'kindergarten'}>Kindergarten 3-6</option>
						<option value={'elementary'}>Elementary 6-12</option>
						<option value={'mid-school'}>Middle School 12-15</option>
						<option value={'high-school'}>High School 15-18</option>
						<option value={'college'}>College 19+</option>
					</select>	
				</div>
			</div>

		) 
	}

    const createNewGame = () => {
        setShowLoading(true)
		setIsGameData(false)
        setIsNewGame(true)
        getNewGame()
        setIsNewGame(false)
    }

    const showAnswers = () => {
        for(const word in answers){
            answers[word].forEach(pos => {
                let row = pos[0]
                let col = pos[1]
                buttonGrid[row][col].classList.remove('bg-white')
                buttonGrid[row][col].classList.add('bg-[#2C80E2]')
                buttonGrid[row][col].classList.add('text-white')
            })

            setFoundWords(prevState => [...prevState, word])

        }
    }

    const clearAnswers = () => {
        for(const word in answers){
            // console.log(word)
            answers[word].forEach(pos => {
                let row = pos[0]
                let col = pos[1]
                // console.log(buttonGrid[row][col])
                buttonGrid[row][col].classList.add('bg-white')
                buttonGrid[row][col].classList.remove('bg-[#2C80E2]')
                buttonGrid[row][col].classList.remove('text-white')
            })

            setFoundWords([])

        }
    }

  return (
    <main className="bg-white flex min-h-fit max-h-full h-full flex-col items-center">
        <div className='game flex flex-col w-fit h-full max-h-full items-center p-5'>
            {/* <div className='text-[40px]'><span className='font-bold text-white'>WORD</span> SEARCH</div> */}
            <Image src={'/logo.png'} width={800} height={5} className={'max-h-[100px]'} />
			<div className={`flex gap-x-3 ${increase ? 'h-[700px] w-[1100px]' : 'h-[600px] w-[1000px]'} p-3`}>
                <div className={`h-full w-[90%] flex ${isNewGame && isGameData ? '' : "justify-center items-center"}`}>
                    {
						isNewGame && isGameData ? <Game /> :  showLoading ? <ArrowPathIcon className={'w-20 h-20 animate-spin'} /> : showMenu() 
                    }
                </div>
                <div className={`${!showLoading && !isGameData ? 'hidden' : ''} h-full border-2 border-black flex flex-col w-[250px] p-2`}>
                    <div className={'flex flex-col w-full gap-4'}>
                        <button className='bg-green-600 text-white p-2 min-w-[150px] h-14' onClick={createNewGame}>New Game</button>
                        <button className='bg-[#5300A8] text-white p-2 min-w-[150px] h-14' onClick={showAnswers}>Answers</button>
                        <button className='bg-[#5300A8] text-white p-2 min-w-[150px] h-14' onClick={clearAnswers}>Clear</button>
                    </div>
					<div className={`mt-5 `}>
                        <label className={'font-bold'} htmlFor={'difficulty'}>Select an age group</label>
                        <select ref={selectRef} className={'bg-green-300 h-10 p-2'} id={'difficulty'} onInput={(event) => onSelectAge(event)}>
                            <option selected value={'kindergarten'}>Kindergarten 3-6</option>
                            <option value={'elementary'}>Elementary 6-12</option>
                            <option value={'mid-school'}>Middle School 12-15</option>
                            <option value={'high-school'}>High School 15-18</option>
                            <option value={'college'}>College 19+</option>
                        </select>
                    </div>
                </div>
            </div>
			<div className={`${showModal ? '' : 'hidden'} fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center text-lg`}>
				<div className={'w-[450px] bg-white p-5 h-fit'}>
					<div className='w-full h-fit flex flex-col justify-center items-center gap-5'>
						<h1 className='text-red-700 font-bold text-lg'>
							Failed to fetch game data!
						</h1>
						<div className='w-[70%] flex justify-center items-center gap-5'>
							<button 
								onClick={() => {setShowModal(false); setShowLoading(false)}}
								className="p-4 flex justify-center items-center rounded-md h-4 bg-red-500 font-bold text-white"
							>
								Close
							</button>
							<button
								onClick={() => {
											setShowModal(false); 
											createNewGame()}
								}
								className='p-4 flex justify-center items-center rounded-md h-4 bg-green-500 font-bold text-white'>
								Retry
							</button>
						</div>
					</div>
				</div>	
			</div>

        </div>
    </main>
  )
}
