import React, {
  CSSProperties,
  ElementRef,
  useCallback,
  useRef,
  useState,
} from "react";
import { HexColorPicker } from "react-colorful";

import useClickOutside from "@/hooks/useClickOutside";
import { cn } from "@/lib/utils";

const ColorPicker = ({
  color,
  onChange,
  className,
}: {
  color: string;
  onChange: (color: string) => void;
  className?: string;
}) => {
  const popover = useRef<ElementRef<"div">>(null);
  const [isOpen, toggle] = useState(false);

  const close = useCallback(() => toggle(false), []);
  useClickOutside(popover, close);

  return (
    <div className={cn("picker", className)}>
      <div
        className="swatch"
        style={{ backgroundColor: color }}
        onClick={() => toggle(true)}
      />
      {isOpen && (
        <div className="popover" ref={popover}>
          <HexColorPicker color={color} onChange={onChange} />
        </div>
      )}
    </div>
  );
};

export default ColorPicker;
