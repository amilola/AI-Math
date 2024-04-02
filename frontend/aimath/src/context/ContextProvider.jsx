"use client";
import { UploadedFileContext } from "./UploadedFileContext";
import { useState } from "react";

// eslint-disable-next-line react/prop-types
export const UploadedFileContextProvider = ({ children }) => {
	const [uploadedFiles, setUploadedFiles] = useState([]);
	// Uploaded files to s3
	const [uploadedFilesCloud, setUploadedFilesCloud] = useState([]);

	function addFile(file) {
		setUploadedFiles((prevState) => [...prevState, file]);
	}

	function deleteFile(files) {
		setUploadedFiles(files);
	}

	function addFileCloud(file) {
		setUploadedFilesCloud((prevState) => [...prevState, file]);
	}

	function deleteFileCloud(files) {
		setUploadedFilesCloud(files);
	}

	const value = {
		uploadedFiles,
		addFile,
		deleteFile,
		uploadedFilesCloud,
		addFileCloud,
		deleteFileCloud,
	};

	return (
		<UploadedFileContext.Provider value={value}>
			{" "}
			{children}{" "}
		</UploadedFileContext.Provider>
	);
};
