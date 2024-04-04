import ProductCard from "@/components/ProductCard";

let productDetails = [
	{
		name: "Word Search",
		imgSrc: "/images/word_search.jpg",
		desc: "A webapp that uses AI to generate words suitable for different class ranges and then uses an algorithm to generate a word search grid.",
	},
	{
		name: "AI Tutor",
		imgSrc: "/images/ai_tutor.png",
		desc: "A webapp that allows for users to query the system for solution to STEM problems and get back step by step solutions.",
	},
];

export default function Home() {
	return (
		<main className="flex min-h-screen flex-col sm:flex-row items-start justify-start p-14 gap-4">
			{productDetails.map((product, idx) => (
				<ProductCard
					key={idx}
					imgSrc={product.imgSrc}
					name={product.name}
					desc={product.desc}
				/>
			))}
		</main>
	);
}
