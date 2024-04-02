import { Box } from "@/components/Grid/Box";
import {useGameContext} from "@/context/GameContext";

export const Row = ({ row }) => {
	const {mode} = useGameContext()
	return (
		<div className={`grid ${mode > 10 ? 'grid-cols-12' : 'grid-cols-10'} gap-x-0`}>
			{row.map((letter, idx) => {
				return <Box key={idx} letter={letter} />;
			})}
		</div>
	);
};
