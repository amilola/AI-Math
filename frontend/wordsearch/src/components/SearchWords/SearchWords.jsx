import { useGridContext } from "@/context/GridContext";
import { useEffect } from "react";
import { Word } from "@/components/SearchWords/Word";
import { useGameContext } from "@/context/GameContext";
import '../../app/globals.css'

export const SearchWords = () => {
	const { searchWords } = useGridContext();
	const { foundWords } = useGameContext();


	useEffect(() => {console.log(foundWords)}, [searchWords, foundWords]);

	return (
		<div className="overflow-y-auto no-scrollbar grid place-items-center grid-row-10 grid-cols-1 w-[30%] border-2 border-black h-full max-h-[700px]">
			{
				// console.log(searchWords)
				searchWords.map((word, idx) => {
					return (
						<Word
							key={idx}
							word={word[0]}
							definition={word[1]}
							isFound={foundWords.includes(word[0])}
						/>
					);
				})
			}
		</div>
	);
};
