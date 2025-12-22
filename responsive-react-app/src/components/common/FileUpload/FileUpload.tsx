import React, { useRef, useState } from 'react';
import './FileUpload.css';

interface FileUploadProps {
  onFileChange?: (file: File | null) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    setFileName(file ? file.name : null);
    if (onFileChange) {
      onFileChange(file);
    }
  };

  return (
    <div className="file-upload-container">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="file-upload-input"
      />
      <button type="button" onClick={handleButtonClick} className="file-upload-button">
        Choose File
      </button>
      {fileName && <span className="file-upload-name">{fileName}</span>}
    </div>
  );
};

export default FileUpload;
