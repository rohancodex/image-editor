"use client";
import React, { useState, useEffect, useRef } from "react";
import ColorPicker from "../ui/ColorPicker";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { motion } from "framer-motion";

interface ImageEditorProps {
  imageUrl: string;
}

const ImageEditor = ({ imageUrl }: ImageEditorProps) => {
  const [text, setText] = useState("");
  const [fontSize, setFontSize] = useState(24);
  const [textColor, setTextColor] = useState("#0d0d0d");
  const imageRef = useRef<HTMLImageElement | null>(null);
  const textRef = useRef<HTMLDivElement | null>(null);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFontSize(parseInt(e.target.value, 10));
  };

  const handleColorChange = (color: string) => {
    setTextColor(color);
  };

  const handleDownload = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!imageRef.current || !textRef.current || !ctx) return;

    const image = imageRef.current;
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;

    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    // Calculate scale based on width
    const scale = canvas.width / image.width;

    const rect = image.getBoundingClientRect();
    const textRect = textRef.current.getBoundingClientRect();

    // Calculate the position of the text relative to the image's scaling
    let textX = (textRect.left - rect.left) * scale;
    let textY = (textRect.top - rect.top) * scale + fontSize * scale;

    ctx.fillStyle = textColor;

    // Adjust font size based on scale
    ctx.font = `${fontSize * scale}px Arial`;

    ctx.fillText(text, textX, textY);

    // Convert canvas to an image and trigger download
    const dataURL = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = "edited-image.png";
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col items-center h-screen gap-8">
      <div className="flex gap-4 items-center">
        <Input
          name="text"
          type="text"
          value={text}
          onChange={handleTextChange}
          placeholder="Editor Image"
        />
        <Input
          name="font-size"
          type="number"
          value={fontSize}
          onChange={handleFontSizeChange}
          placeholder="Font Size"
        />
        <ColorPicker color={textColor} onChange={handleColorChange} />
        <Button onClick={handleDownload}>Download</Button>
      </div>
      <motion.div className="relative h-full w-full flex justify-center items-center border-2">
        <img
          src={imageUrl}
          alt="Editor"
          className="max-w-full max-h-full object-contain"
          ref={imageRef}
        />
        <motion.div
          drag
          dragConstraints={imageRef}
          className="inline-block absolute hover:cursor-pointer active:cursor-grab"
          style={{
            fontSize: `${fontSize}px`,
            color: textColor,
            userSelect: "none",
          }}
          ref={textRef}
        >
          {text}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ImageEditor;
