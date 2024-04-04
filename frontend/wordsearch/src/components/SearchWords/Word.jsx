
export const Word = ({ word, definition, isFound }) => {
    return (
        <div className={`word flex flex-col cursor-default justify-between items-center w-[90%] p-2`}>
			<span className={`font-bold text-xl w-fit ${isFound ? 'line-through' : ''}`}>{word}</span>
			<p className={`w-full h-fit text-[10px] text-slate-700 p-2`}>
					{definition}
			</p>	
        </div>
    )
}
