import React, { useState, useRef, ElementRef } from "react";
import ColorPicker from "../ui/ColorPicker";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { PanInfo, motion } from "framer-motion";
import { Label } from "../ui/label";

interface ImageEditorProps {
  imageUrl: string;
}
interface HistoryState {
  text: string;
  fontSize: number;
  textColor: string;
  position: { x: number; y: number };
}

const ImageEditor = ({ imageUrl }: ImageEditorProps) => {
  const [text, setText] = useState("");
  const [fontSize, setFontSize] = useState(24);
  const [textColor, setTextColor] = useState("#0d0d0d");

  const imageRef = useRef<ElementRef<"img">>(null);
  const textRef = useRef<ElementRef<"div">>(null);

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(0);
  const [history, setHistory] = useState<HistoryState[]>([
    { text, fontSize, textColor, position },
  ]);

  const updateStateWithHistory = (newState: HistoryState) => {
    setText(newState.text);
    setFontSize(newState.fontSize);
    setTextColor(newState.textColor);
    setPosition(newState.position);
  };

  const pushToHistory = (newState: HistoryState) => {
    const newHistory = history.slice(0, currentHistoryIndex + 1);
    newHistory.push(newState);
    setHistory(newHistory);
    setCurrentHistoryIndex(newHistory.length - 1);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newText = e.target.value;
    setText(newText);
    pushToHistory({ text: newText, fontSize, textColor, position });
  };

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFontSize = parseInt(e.target.value, 10);
    setFontSize(newFontSize);
    pushToHistory({ text, fontSize: newFontSize, textColor, position });
  };

  const handleColorChange = (color: string) => {
    setTextColor(color);
    pushToHistory({ text, fontSize, textColor: color, position });
  };

  const handleDragEnd = (event: Event, info: PanInfo) => {
    const newPosition = {
      x: position.x + info.offset.x,
      y: position.y + info.offset.y,
    };
    setPosition(newPosition);
    pushToHistory({ text, fontSize, textColor, position: newPosition });
  };

  const undo = () => {
    if (currentHistoryIndex > 0) {
      setCurrentHistoryIndex(currentHistoryIndex - 1);
      updateStateWithHistory(history[currentHistoryIndex - 1]);
    }
  };

  const redo = () => {
    if (currentHistoryIndex < history.length - 1) {
      setCurrentHistoryIndex(currentHistoryIndex + 1);
      updateStateWithHistory(history[currentHistoryIndex + 1]);
    }
  };

  const handleDownload = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!imageRef.current || !textRef.current || !ctx) return;

    const image = imageRef.current;
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;

    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    const scale = canvas.width / image.width;

    const rect = image.getBoundingClientRect();
    const textRect = textRef.current.getBoundingClientRect();

    let textX = (textRect.left - rect.left) * scale;
    let textY = (textRect.top - rect.top) * scale + fontSize * scale;

    ctx.fillStyle = textColor;
    ctx.font = `${fontSize * scale}px Arial`;
    ctx.fillText(text, textX, textY);

    const dataURL = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = "edited-image.png";
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col items-center lg:h-screen gap-8">
      <div className="flex items-center gap-4 w-full">
        <Input
          name="text"
          type="text"
          value={text}
          onChange={handleTextChange}
          placeholder="Enter Text"
        />
        <Button className="w-auto flex-1" onClick={() => setText("")}>
          Clear
        </Button>
      </div>
      <div className="flex flex-col md:flex-row gap-4 w-full items-center">
        <div className="flex md:flex-row gap-4 items-center w-full">
          <div className="flex gap-2 items-center w-auto">
            <p>Color:</p>
            <ColorPicker color={textColor} onChange={handleColorChange} />
          </div>
          <div className="flex gap-2 items-center w-full">
            <Label htmlFor="font-size">Font size:</Label>
            <Input
              id="font-size"
              className="w-auto flex-grow md:flex-none"
              name="font-size"
              type="number"
              value={fontSize}
              onChange={handleFontSizeChange}
              placeholder="Font Size"
            />
          </div>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <Button
            className="flex-1 "
            onClick={undo}
            disabled={currentHistoryIndex === 0}
          >
            Undo
          </Button>
          <Button
            className="flex-1 "
            onClick={redo}
            disabled={currentHistoryIndex === history.length - 1}
          >
            Redo
          </Button>
        </div>

        <Button className="w-full md:w-auto" onClick={handleDownload}>
          Download
        </Button>
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
          onDragEnd={handleDragEnd}
          className="inline-block absolute hover:cursor-pointer active:cursor-grab"
          style={{
            fontSize: `${fontSize}px`,
            color: textColor,
            userSelect: "none",
          }}
          animate={{ x: position.x, y: position.y }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          ref={textRef}
        >
          {text}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ImageEditor;
