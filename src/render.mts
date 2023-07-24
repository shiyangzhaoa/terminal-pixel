import { ansi16mClose, ansi16mOpen } from "./ansi-styles/index.mjs";

import type { ImageData } from 'canvas';

const getColorBy = (data: Uint8ClampedArray, index: number) => (type: 'color' | 'bgColor') => {
  const r = data[index];
  const g = data[index + 1];
  const b = data[index + 2];
  const a = data[index + 3];

  if (r === undefined) {
    return;
  }
  
  const open = a !== 0 ? ansi16mOpen[type](r, g, b) : ansi16mOpen[type](255, 255, 255);

  return open;
}

export const renderImageData = (imageData: ImageData) => (outStr = '') => {
  const { width, height, data } = imageData;

  for (let row = 0; row < height; row += 2) {
    for (let col = 0; col < width; col += 1) {
      const topIndex = ((row * width) + col) * 4;
      const bottomIndex = (((row + 1) * width) + col) * 4;

      const color = getColorBy(data, topIndex)('color');
      const bgColor = getColorBy(data, bottomIndex)('bgColor');

      outStr += bgColor ? `${bgColor}${color}▀${ansi16mClose.all}` : `${color}▀${ansi16mClose.all}`;
    }

    outStr += '\n';
  }

  return outStr;
}
