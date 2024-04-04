// "use client";
import { useEffect, useRef } from "react";
import Script from "next/script";
import ReactDOM from "react-dom";

// eslint-disable-next-line react/prop-types
const Message = ({ data }) => {
	/*
    props
      - data : the data stating if this is an AI's response on
      - showDetails : it means that do we need to show the message sender's details
  */
	const textRef = useRef(null);
	// console.log(data.data)
	const isUser = data.role === "User";
	const bg = isUser ? "bg-white" : "bg-white";

	// Displaying the message text
	useEffect(() => {
		// console.log(katex.renderToString(data.data))
		if (isUser) {
			textRef.current.innerHTML = data.data;
		} else {
			let text = "";
			data.data.split("\n").forEach((str) => {
				text += str + " <br> ";
			});
			textRef.current.innerHTML = text;
		}
	}, [isUser, data, textRef]);

	// Typesetting the latex with Katex
	useEffect(() => {
		// ReactDOM.preload(
		// 	"https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js",
		// 	{ as: "script" }
		// );
		// console.log(renderMathInElement);
		// document.addEventListener("DOMContentLoaded", () => {
		renderMathInElement(document.body, {
			// customised options
			// • auto-render specific keys, e.g.:
			delimiters: [
				{ left: "$$", right: "$$", display: true },
				{ left: "$", right: "$", display: false },
				{ left: "\\(", right: "\\)", display: false },
				{ left: "\\[", right: "\\]", display: true },
			],
			// • rendering keys, e.g.:
			throwOnError: false,
		});
		// });
	});

	return (
		<div
			className={`w-full ${bg} min-w-[340px] ${
				!isUser ? "mb-5" : "mb-1"
			} shadow-lg border-solid border-2`}
		>
			<section className="flex w-full p-2">
				{
					<div className="w-[40px] h-[40px] md:w-[50px] md:h-[50px] bg-slate-900 flex justify-center items-center">
						{data.role}
					</div>
				}
				{/*<img />*/}
				<div className="sm:w-[50%] w-full md:w-[90%] ml-1 md:ml-5 md:col-span-11">
					<div
						// onInput={(event) => {
						//     event.target.style.height = "5px";
						//     event.target.style.height = event.target.scrollHeight + "px";
						// }}
						className={`w-full px-1 md:grid-cols-1 items-start ${bg} md:px-2 outline-none text-left text-black leading-loose`}
						ref={textRef}
						// value={data.data}
						// readOnly={true}
					></div>
				</div>
			</section>

			{/* <Script id="format-latex">
				{`
					console.log('This is firing!')
					console.log(document.body)
					renderMathInElement(document.body, {
						// customised options
						// • auto-render specific keys, e.g.:
						delimiters: [
							{ left: "$$", right: "$$", display: true },
							{ left: "$", right: "$", display: false },
							{ left: "\\(", right: "\\)", display: false },
							{ left: "\\[", right: "\\]", display: true },
						],
						// • rendering keys, e.g.:
						throwOnError: false,
					});
				`}
			</Script> */}
		</div>
	);
};

export default Message;
