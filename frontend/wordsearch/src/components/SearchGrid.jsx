import { useEffect } from "react";
import { useGridContext } from "@/context/GridContext";

import { Row } from "@/components/Grid/Row";

export const SearchGrid = () => {
	const { grid, setButtonGrid } = useGridContext();

	useEffect(() => {
		let rows = [];
		let cols = [];
		let buttons = Array.from(document.getElementsByClassName("letter"));
		buttons.forEach((button, idx) => {
			// console.log(idx)
			// console.log(grid[0].length)
			cols.push(button);
			if (cols.length % grid[0].length === 0 && idx > 0) {
				rows.push(cols);
				cols = [];
			}
		});

		setButtonGrid(rows);
	}, [grid]);


	return (
		<div
			className="grid w-fit place-items-center px-1 h-full border-2 border-black mr-6 gap-0"
			// onMouseDown={(event) => onCrossStart(event)}
			// onMouseUp={(event) => onCrossEnd(event)}
		>
			{grid.map((row, idx) => {
				return <Row key={idx} row={row} />;
			})}
		</div>
	);
};
