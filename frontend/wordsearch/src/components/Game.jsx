import {SearchWords} from "@/components/SearchWords/SearchWords";
import {SearchGrid} from "@/components/SearchGrid";

export const Game = () => {
	return (
        <div className={'flex gap-5 w-full justify-between'}>
            <SearchWords />
            <SearchGrid />
        </div>
    )
}
