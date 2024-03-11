"use client";
import React, { useRef, useEffect, useState } from "react";
import ColorPicker from "../ui/ColorPicker";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

interface ImageEditorProps {
  imageUrl: string;
}

const ImageEditor = ({ imageUrl }: ImageEditorProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [text, setText] = useState("");
  const [fontSize, setFontSize] = useState(24);
  const [textPosition, setTextPosition] = useState<{
    x: number;
    y: number;
  }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [textColor, setTextColor] = useState("#0d0d0d"); // Initial color is red

  useEffect(() => {
    //draw image
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const image = new Image();
    image.onload = () => {
      const width = canvas.parentElement!.clientWidth;

      const aspectRatio = image.width / image.height;
      const scaledWidth = width;
      const scaledHeight = width / aspectRatio;

      canvas.width = scaledWidth;
      canvas.height = scaledHeight;

      // Draw the scaled image for preview
      ctx.drawImage(image, 0, 0, scaledWidth, scaledHeight);
      setTextPosition({
        x: canvas.width / 2,
        y: canvas.height / 2,
      });
    };
    image.src = imageUrl;
    imageRef.current = image;
  }, [imageUrl]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const img = imageRef.current;

    if (canvas && ctx && img) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      ctx.font = `${fontSize}px sans-serif`;
      ctx.fillStyle = textColor;
      ctx.fillText(text, textPosition.x, textPosition.y);
    }
  }, [text, fontSize, textPosition, textColor]);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFontSize(parseInt(e.target.value));
  };

  const handleColorChange = (color: string) => {
    setTextColor(color);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.font = `${fontSize}px Arial`;
    const textWidth = ctx.measureText(text).width;
    const textHeight = fontSize;

    const isInsideText =
      x >= textPosition.x - textWidth / 2 &&
      x <= textPosition.x + textWidth / 2 &&
      y >= textPosition.y - textHeight / 2 &&
      y <= textPosition.y + textHeight / 2;

    if (isInsideText) {
      setIsDragging(true);
      setDragOffset({
        x: x - textPosition.x,
        y: y - textPosition.y,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !isDragging) return;

    const rect = canvas.getBoundingClientRect();
    const newX = e.clientX - rect.left - dragOffset.x;
    const newY = e.clientY - rect.top - dragOffset.y;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const textWidth = ctx.measureText(text).width;
    const textHeight = fontSize;

    // Check if the new position is within the canvas bounds
    const maxX = canvas.width - textWidth;
    const maxY = canvas.height - textHeight;
    const minX = 0;
    const minY = 0;

    setTextPosition({
      x: Math.max(minX, Math.min(newX, maxX)),
      y: Math.max(minY, Math.min(newY, maxY)),
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const image = new Image();
    image.src = imageUrl;

    image.onload = () => {
      const downloadCanvas = document.createElement("canvas");
      downloadCanvas.width = image.width;
      downloadCanvas.height = image.height;

      const downloadCtx = downloadCanvas.getContext("2d");
      if (!downloadCtx) return;

      downloadCtx.drawImage(image, 0, 0);

      // Calculate the scale factor for the font size
      const scaleX = image.width / canvas.width;
      const scaleY = image.height / canvas.height;
      const scaleFactor = Math.min(scaleX, scaleY);

      // Overlay text on the original image
      const scaledFontSize = fontSize * scaleFactor;
      downloadCtx.font = `${scaledFontSize}px Arial`;
      downloadCtx.fillStyle = textColor; // Use the selected color

      // Calculate the text position based on the center of the downloaded canvas
      downloadCtx.fillText(
        text,
        textPosition.x * scaleX,
        textPosition.y * scaleY
      );

      // Download the edited image
      const link = document.createElement("a");
      link.download = "edited_image.png";
      link.href = downloadCanvas.toDataURL("image/png");
      link.click();
    };
  };

  return (
    <div className="flex flex-col items-center h-screen gap-8">
      <div className="flex gap-4 items-center">
        <Input
          name="text"
          type="text"
          value={text}
          onChange={handleTextChange}
          placeholder="Enter text"
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
      <div className="relative h-full w-full">
        <canvas
          ref={canvasRef}
          className="max-w-full max-h-full object-contain"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        />
      </div>
    </div>
  );
};

export default ImageEditor;
