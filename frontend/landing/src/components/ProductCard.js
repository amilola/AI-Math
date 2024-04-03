"use client";
import Image from "next/image";

export default function ProductCard({ imgSrc, name, desc }) {
	let URL = name.includes("search")
		? "https://word-search.dywno4kca4mbu.amplifyapp.com"
		: "https://ai-math.dywno4kca4mbu.amplifyapp.com/";
	function handleClick() {
		console.info("Clicked on Word Search");
		window.location.assign(URL);
	}

	return (
		<div
			className="bg-slate-800 w-[250px] h-[400px] text-white flex flex-col hover:scale-105 hover:ease-in-out duration-500 cursor-pointer"
			onClick={handleClick}
		>
			<div className="border-b-2 border-b-white m-2 px-2 pt-2 pb-5">
				<Image
					src={imgSrc}
					alt="product image"
					className="bg-white"
					width={250}
					height={150}
				/>
			</div>
			<div className="p-4">
				<span className="text-[25px] cursor-default">{name}</span>
				<p className="text-[12px]">{desc}</p>
			</div>
		</div>
	);
}
