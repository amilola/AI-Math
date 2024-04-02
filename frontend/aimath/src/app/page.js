"use client";
import ChatRoom from "@/components/ChatRoom.jsx";
import ReactDOM from "react-dom";
import { useEffect } from "react";
import Script from "next/script";

export default function Home() {
	useEffect(() => {
		ReactDOM.preload(
			"https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css",
			{ as: "style" }
		);

		// ReactDOM.preload(
		// 	"https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js",
		// 	{ as: "script" }
		// );
	}, []);

	return (
		<main className="flex h-screen flex-col items-center justify-between px-3 pt-5">
			<Script src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js" />
			<Script src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js" />
			<ChatRoom />
		</main>
	);
}
