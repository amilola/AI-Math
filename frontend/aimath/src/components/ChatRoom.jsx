import { useState, useEffect, useRef } from "react";
import Message from "@/components/Message.jsx";
import axios from "axios";
import {
	PaperAirplaneIcon,
	UploadIcon,
	ChevronUpIcon,
} from "@heroicons/react/solid";
import { useUploadedFileContext } from "@/context/UploadedFileContext.js";
import UploadedFile from "@/components/UploadedFile.jsx";

const ChatRoom = () => {
	// to get the messages and store it here
	const [messages, setMessages] = useState([]);
	// Current input field value
	const [text, setText] = useState("");
	// is send button enabled or not
	const [sendButton, setSendButton] = useState(false);
	// Uploaded files
	const { uploadedFiles, addFile, addFileCloud, uploadedFilesCloud } =
		useUploadedFileContext();

	// current uploaded file name
	const [fileName, setFileName] = useState("");
	// Show Files
	const [showFiles, setShowFiles] = useState(true);

	// dummy reference just to scroll
	const dummy = useRef(null);
	// to send the message through ctrl+enter
	const formRef = useRef(null);
	const messageInputRef = useRef(null);

	// Scroll every time as we send the messages
	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	// useEffect(() => {
	//     if(typeof window?.MathJax !== "undefined"){
	//         // console.log(window?.MathJax)
	//         window?.MathJax.typeset()
	//
	//     }
	// }, [messages])

	/* function just to scroll to the bottom to the dummy div */
	function scrollToBottom() {
		dummy.current.scrollIntoView({ behavior: "smooth" });
	}

	// It send the message to the API for processing
	async function sendMessage(event) {
		event.preventDefault();
		setText("");
		// messageInputRef.current.style.height = "100%";

		setSendButton(false);

		// Checking if text or image is empty then don't send the message
		if (!text) return null;

		// setMessages((prevState) => [
		// 	...prevState,
		// 	{ role: "User", data: text },
		// ]);

		// let data = JSON.stringify({
		// 	question: text,
		// 	image_link:
		// 		uploadedFilesCloud.length !== 0
		// 			? uploadedFilesCloud.map((file) => file.url)
		// 			: null,
		// });

		console.log(
			JSON.stringify({
				question: text,
				image_links:
					uploadedFilesCloud.length !== 0
						? uploadedFilesCloud.map((file) => file.url)
						: null,
			})
		);

		let config = {
			method: "post",
			url: "http://localhost:5000/question",
			headers: {
				"Content-Type": "application/json",
			},
			data: JSON.stringify({
				question: text,
				image_links:
					uploadedFilesCloud.length !== 0
						? uploadedFilesCloud.map((file) => file.url)
						: null,
			}),
		};

		let formatConfig = {
			method: "post",
			url: "http://localhost:5000/format",
			headers: {
				"Content-Type": "application/json",
			},
			data: JSON.stringify({
				question: text,
				image_link: null,
			}),
		};

		// axios(config)
		// 	.then(function (response) {
		// 		console.log(response.data);
		// 		response.status === 200
		// 			? setMessages((prevState) => [
		// 					...prevState,
		// 					{
		// 						role: "AI",
		// 						data: response.data.answer_content,
		// 					},
		// 			  ])
		// 			: null;
		// 	})
		// 	.finally(() => {
		// 		setSendButton(false);
		// 		scrollToBottom();
		// 	})
		// 	.catch(function (error) {
		// 		console.log(error);
		// 	});

		axios(formatConfig)
			.then((response) => {
				setMessages((prevState) => [
					...prevState,
					{ role: "User", data: response.data },
				]);
			})
			.finally(() => {
				axios(config)
					.then(function (response) {
						console.log(response.data);
						response.status === 200
							? setMessages((prevState) => [
									...prevState,
									{
										role: "AI",
										data: response.data.answer_content,
									},
							  ])
							: null;
					})
					.finally(() => {
						setSendButton(false);
						scrollToBottom();
					})
					.catch(function (error) {
						console.log(error);
					});
			})
			.catch((error) => console.log(error));
	}

	async function uploadImage(formData, file) {
		axios
			.put(`http://localhost:5000/image_upload`, formData)
			.then(function (response) {
				console.log(response.data);
				addFileCloud(response.data);
				addFile(file);
			})
			// .finally(() => {
			//     console.log(uploadedFilesCloud)
			// })
			.catch(function (error) {
				console.log(error);
			});
	}

	function handleDragIn() {
		formRef.current.style.borderColor = "#2B6992";
	}

	function handleDragOut() {
		formRef.current.style.borderColor = "#F4F4F5";
	}

	function handleDrop(event) {
		if (event.dataTransfer.files && event.dataTransfer.files[0]) {
			for (let i = 0; i < event.dataTransfer.files["length"]; i++) {
				let formData = new FormData();

				formData.append("image_file", event.dataTransfer.files[i]);

				uploadImage(formData, event.dataTransfer.files[i]);
			}
		}
	}

	function showUploadedFiles() {
		showFiles
			? document
					.querySelector("#showFilesIcon")
					.classList.add("rotate-180")
			: document
					.querySelector("#showFilesIcon")
					.classList.remove("rotate-180");
		showFiles && uploadedFiles.length !== 0
			? document
					.querySelector("#uploadedFiles")
					.classList.remove("hidden")
			: document.querySelector("#uploadedFiles").classList.add("hidden");
		setShowFiles(!showFiles);
	}

	return (
		<div className="flex flex-col w-full gap-0 h-screen relative lg:mx-auto lg:my-0 ">
			{/* main Chat content */}
			<div className="flex flex-col px-12 overflow-x-hidden scrollbar-hide h-[90%] w-full max-w-[1500px] mx-auto pb-4">
				{messages &&
					messages.map((message, i) => {
						return (
							<Message
								key={i}
								// showDetails={showDetails}
								data={message}
							/>
						);
					})}

				{/* Dummy div onScrollBottom we scroll to here */}
				<div ref={dummy}></div>
			</div>

			{/* input form */}
			<div className="min-w-[300px] md:w-[60%] lg:w-[70%] xl:w-[40%] sm:w-[90%] flex justify-center my-5 fixed bottom-[10px] xl:left-[30%] lg:left-[14%] md:left-[10%] left-[5%]">
				<form
					ref={formRef}
					className="sticky w-full bottom-0 z-50 bg-zinc-100 dark:text-black h-16 flex justify-between gap-4 border-solid border-2 shadow-2xl rounded-lg relative"
					onSubmit={sendMessage}
					onDragEnter={handleDragIn}
					onDrop={(event) => handleDrop(event)}
					onDragLeave={handleDragOut}
					// onDragOver={handleDragIn}
				>
					<textarea
						ref={messageInputRef}
						type="text"
						// onInput={(event) => {
						// 	event.target.style.height = "100%";
						// 	event.target.style.height =
						// 		event.target.scrollHeight + "px";
						// }}
						placeholder="Type your question..."
						value={text}
						onChange={(event) => {
							setText(event.target.value);
							setSendButton(true);
						}}
						// flex resize-none items-start max-w-full w-full h-10 lg:max-w-screen-md p-2 placeholder-black text-black outline-none resize-none scrollbar-hide bg-transparent
						className="block w-full resize-none h-full rounded-l-lg outline-none scrollbar-hide text-left py-5 px-4"
					></textarea>

					<div className={"flex h-full items-center justify-center"}>
						<div className={"flex flex-row items-center h-full"}>
							<button
								className={`p-2 ${
									!text
										? "text-black"
										: "bg-green-600 text-black"
								} ${
									sendButton
										? "cursor-pointer"
										: "cursor-not-allowed"
								} rounded-full flex items-center`}
								type="submit"
								onClick={sendMessage}
							>
								<PaperAirplaneIcon
									className={`w-6 h-6 rotate-90`}
								/>
							</button>
						</div>
						<div className={"flex flex-row items-center h-full"}>
							<input
								className={"p-2"}
								id="custom-file-picker"
								type={"file"}
								onChange={(event) => {
									setFileName(event.target.files[0].name);
									// console.log(typeof)
									// addFile(event.target.files[0])
									let formData = new FormData();
									formData.append(
										"image_file",
										event.target.files[0]
									);

									uploadImage(
										formData,
										event.target.files[0]
									);
								}}
								hidden
								accept={"image/png, image/jpeg"}
							/>
							<label
								htmlFor="custom-file-picker"
								className={"p-2 bg-none cursor-pointer"}
							>
								<UploadIcon className={`w-6 h-6`} />
							</label>
						</div>
						<div
							className={`flex flex-row items-center ${
								uploadedFiles.length >= 1 ? "" : "hidden"
							} h-full`}
						>
							<ChevronUpIcon
								className={`w-8 h-8 cursor-pointer`}
								id={"showFilesIcon"}
								onClick={(event) => showUploadedFiles(event)}
							/>
						</div>
					</div>
					{/* h-[150px] max-h-[150px] right-[-10%] top-[-260%] */}
					<div
						id={"uploadedFiles"}
						className={`absolute ${
							uploadedFiles.length === 0 ? "hidden" : ""
						} hidden w-[200px]  overflow-y-auto flex flex-col-reverse items-center gap-2 h-full -right-20 -top-20`}
					>
						{uploadedFiles.map((file, idx) => {
							return (
								<UploadedFile key={idx} fileName={file.name} />
							);
						})}
					</div>
				</form>
			</div>
		</div>
	);
};

export default ChatRoom;
