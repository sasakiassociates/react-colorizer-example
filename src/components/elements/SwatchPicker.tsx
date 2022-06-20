import { observer } from "mobx-react";
import React, { MouseEventHandler, useRef, useState } from "react";
import { Swatch } from "./Swatch";
import { RgbaColorPicker, RgbaColor } from "react-colorful";
import { hexToRgb, rgbaToHex, useOnClickOutside } from "../../helpers/helpers";

type SwatchPickerProps = {
    color: string,
    setColor: (color: string) => void,
    alpha?: number,
    setAlpha?: (alpha: number) => void
};
export const SwatchPicker = observer(({ color, setColor, alpha, setAlpha }: SwatchPickerProps) => {
    const [open, setOpen] = useState<boolean>(false);
    const wrapperRef = useRef(null);

    const handleClickOutside = () => {
        setOpen(false);
    }

    let pickerColor: RgbaColor;
    const { r, g, b } = hexToRgb(color);
    pickerColor = {
        r, g, b, a : 1
    };
    if (alpha !== undefined && alpha !== 1) {
        pickerColor.a = alpha;
    }

    useOnClickOutside(wrapperRef, handleClickOutside)
    return <div className="SwatchPicker">
        <Swatch color={color} onClick={() => {
            setOpen(!open);
        }}/>
        {open && <div className="picker-open" ref={wrapperRef}><RgbaColorPicker
            color={pickerColor}
            onChange={(color: RgbaColor) => {
                setColor(rgbaToHex( color));
                if (setAlpha) setAlpha(color.a);
            }}
        /></div>}
    </div>;
});
