
import { UploadedFileContextProvider } from "@/context/ContextProvider.jsx";

import "./globals.css";

export const metadata = {
	title: "Create Next App",
	description: "Generated by create next app",
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body className="bg-white shadow-2xl border-solid border-2 w-full h-screen dark:text-white">
				
				{
					<UploadedFileContextProvider>
						{children}
					</UploadedFileContextProvider>
				}
			</body>
		</html>
	);
}