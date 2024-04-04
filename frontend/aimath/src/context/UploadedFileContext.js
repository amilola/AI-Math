import {createContext, useContext} from "react";

export const UploadedFileContext = createContext({
    uploadedFiles: [],
    addFile(files){},
    deleteFile(files){},
    uploadedFilesCloud: [],
    addFileCloud(file){},
    deleteFileCloud(file){}
})

export const useUploadedFileContext = () => useContext(UploadedFileContext)