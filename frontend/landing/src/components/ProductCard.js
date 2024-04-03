"use client";
import Image from "next/image";

export default function ProductCard({ imgSrc, name }) {
	function handleClick() {
		console.info("Clicked");
	}

	return (
		<div
			className="bg-slate-300 w-[250px] h-[400px] flex flex-col hover:scale-105 hover:ease-in-out duration-500 cursor-pointer"
			onClick={handleClick}
		>
			<Image
				src={imgSrc}
				alt="product image"
				className="p-2"
				width={250}
				height={150}
			/>
			<div className="p-4">
				<span className="text-[25px] cursor-default">{name}</span>
				<p className="text-[12px]">
					A webapp that uses AI to generate words suitable for
					different class ranges and then uses an algorithm to
					generate a word search grid.
				</p>
			</div>
		</div>
	);
}
