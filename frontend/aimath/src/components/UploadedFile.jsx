import { DocumentIcon, XIcon } from "@heroicons/react/solid";
import { useUploadedFileContext } from "@/context/UploadedFileContext.js";
import axios from "axios";

const UploadedFile = ({ fileName }) => {
	const { uploadedFiles, deleteFile, uploadedFilesCloud, deleteFileCloud } =
		useUploadedFileContext();

	function deleteUploadedFile() {
		axios
			.delete(`http://localhost:5000/image_delete?file_name=${fileName}`)
			.then((response) => {
				if (response.status === 200) {
					deleteFileCloud(
						uploadedFilesCloud.filter(
							(file) => file.name !== fileName
						)
					);
				} else {
					throw new Error(
						"An error occurred while trying to delete the image"
					);
				}
			})
			.finally(() => {
				deleteFile(
					uploadedFiles.filter((file) => file.name != fileName)
				);
			})
			.catch((error) => console.log(error));
	}

	return (
		<div
			className={
				"flex flex-row justify-between bg-gray-300 items-center p-3 w-[200px]"
			}
		>
			<DocumentIcon className={"w-4 h-4"} />
			<span className={"text-sm mx-2"}>
				{`${fileName.substring(0, 10)}...`}
			</span>
			<XIcon
				className={"w-4 h-4 cursor-pointer"}
				onClick={deleteUploadedFile}
			/>
		</div>
	);
};

export default UploadedFile;
