import { Command } from 'commander';
import { createCanvas, loadImage } from 'canvas';
import sizeOf from 'image-size';

import { ansi16mClose, ansi16mOpen } from './ansi-styles/index.mjs';

const program = new Command();

const DEFAULT_SIZE = 120;
const getLT = (max: number) => (v: number) => v > max ? max : v;

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

program
  .name('terminal-pixel')
  .description('Render pixel in your terminal')
  .version('1.0.0');

program
  .argument('<string>', 'src of image')
  .option('-s, --size <string>', 'size of canvas')
  .option('--disable-linewrap', 'disable linewrap')
  .action(async (src, options) => {
    const maxWidth = process.stdout.columns;
    const getLTMax = getLT(maxWidth);
    const dimensions = sizeOf(src);

    let size = {
      width: getLTMax(dimensions.width || DEFAULT_SIZE),
      height: dimensions.height || DEFAULT_SIZE,
    };

    if (options.size) {
      const [width, height] = options.size.split('x');
      const h = height ? +height : +width;

      size = {
        width: getLTMax(+width),
        height: h,
      };
    }

    const canvas = createCanvas(size.width, size.height);
    const ctx = canvas.getContext('2d');
    const image = await loadImage(src);

    ctx.drawImage(image, 0, 0, dimensions.width || size.width, dimensions.height || size.height);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const { width, height, data } = imageData;

    let outStr = '';

    if (options.disableLinewrap)
      outStr += '\u001B[?7l'; // https://espterm.github.io/docs/VT100%20escape%20codes.html

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

    if (options.disableLinewrap)
      outStr += '\u001B[?7h'; // Restore line wrapping

    console.log(outStr);
  });

program.parse();
