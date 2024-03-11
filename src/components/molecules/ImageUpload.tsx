"use client";
import { Upload } from "lucide-react";
import React, { useRef } from "react";

const FileUpload = ({
  onImageUpload,
}: {
  onImageUpload: (image: string | ArrayBuffer | null) => void;
}) => {
  const fileInputRef = useRef(null);

  const handleFileUpload = (event: any) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      onImageUpload(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col items-center justify-center ">
      <div className="flex items-center justify-center">
        <label
          htmlFor="file-input"
          className="cursor-pointer p-4 flex flex-col w-full h-32 border-4 border-dashed hover:bg-muted hover:border-gray-300"
        >
          <div className="flex flex-col items-center justify-center pt-7">
            <Upload className="w-8 h-8 text-gray-400 group-hover:text-gray-600" />
            <p className="pt-1 text-sm tracking-wider text-gray-400 group-hover:text-gray-600">
              <span className="font-semibold">Click to upload</span> or drag and
              drop
            </p>
          </div>
          <input
            id="file-input"
            name="file-input"
            type="file"
            className="hidden"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileUpload}
          />
        </label>
      </div>
    </div>
  );
};

export default FileUpload;
