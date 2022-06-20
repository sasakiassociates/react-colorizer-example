// import {IRect} from "../types/IRect";
import React, { RefObject, useEffect } from "react";
import { RgbColor } from "react-colorful";

export const getUid = () => `${Math.random() * 100000000000}`.replace('.', '');

type AnyEvent = MouseEvent | TouchEvent

export const useOnClickOutside = <T extends HTMLElement = HTMLElement>(
    ref: RefObject<T>,
    handler: (event: AnyEvent) => void,
): void => {
    useEffect(() => {
        const listener = (event: AnyEvent) => {
            const el = ref?.current

            // Do nothing if clicking ref's element or descendent elements
            if (!el || el.contains(event.target as Node)) {
                return
            }

            handler(event)
        }

        document.addEventListener(`mousedown`, listener)
        document.addEventListener(`touchstart`, listener)

        return () => {
            document.removeEventListener(`mousedown`, listener)
            document.removeEventListener(`touchstart`, listener)
        }

        // Reload only if ref or handler changes
    }, [ref, handler])
};


export const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
}

export const hexToArr = (color: string) => {
    let rgb = hexToRgb(color);
    const { r, g, b } = rgb;
    return [r / 255, g / 255, b / 255, 0.5];
}

const format = (number: number) => {
    const hex = number.toString(16);
    return hex.length < 2 ? "0" + hex : hex;
};

export const rgbaToHex = ({ r, g, b }: RgbColor): string => {
    return "#" + format(r) + format(g) + format(b);
};
