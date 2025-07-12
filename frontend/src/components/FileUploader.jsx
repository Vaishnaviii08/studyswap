import React, {useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { FileText } from "react-bootstrap-icons";

const FileUploader = ({ onFileSelect }) => {

  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles[0]); // Send the first selected file to parent
      }
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false, // single file only
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc", ".docx"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
      "application/vnd.ms-powerpoint": [".ppt", ".pptx"],
      "application/vnd.openxmlformats-officedocument.presentationml.presentation":
        [".pptx"],
      "application/vnd.ms-excel": [".xls", ".xlsx"],
      "text/plain": [".txt"],
    },
  });

  return (
    <div
      {...getRootProps()}
      className="d-flex justify-content-center w-full p-6 border-2 border-dashed border-violet-500 rounded-xl text-center cursor-pointer hover:bg-violet-50 transition"
      
    >

      <input {...getInputProps()} />
      <div className="d-flex align-items-center mb-4" style={{ gap: "1rem" }}>
        <div className="bg-indigo-100 text-indigo-600 rounded-xl">
          <FileText size={96} />
        </div>
        <div>
          <h4 className="mb-2 fw-bold fs-4" style={{ fontSize: "2.5rem" }}>Upload a File</h4>
          <p className="mb-0 text-muted small" style={{ fontSize: "1.25rem" }}>
            Contribute study materials to the community
          </p>
        </div>
      </div>
      
    </div>
  );
};

export default FileUploader;
