import { Command } from 'commander';
import { createCanvas, loadImage } from 'canvas';
import sizeOf from 'image-size';

import { ansi16mClose, ansi16mOpen } from './ansi-styles/index.mjs';

const program = new Command();

const getColorBy = (data: Uint8ClampedArray, index: number) => (type: 'color' | 'bgColor') => {
  const r = data[index];
  const g = data[index + 1];
  const b = data[index + 2];
  const a = data[index + 3];
  const open = a !== 0 ? ansi16mOpen[type](r, g, b) : ansi16mOpen[type](255, 255, 255);

  return open;
}

program
  .name('terminal-pixel')
  .description('Render pixel in your terminal')
  .version('1.0.0');

program
  .argument('<string>', 'src of image')
  .option('-s, --size <number>', 'size of canvas')
  .option('-w, --width <number>', 'width of canvas')
  .option('-h, --height <number>', 'height of canvas')
  .action(async (src, options) => {
    const dimensions = sizeOf(src)
    const size = {
      width: +options.width || +options.size || dimensions.width || 120,
      height: +options.height || +options.size || dimensions.height || 120,
    };

    const canvas = createCanvas(size.width, size.height);
    const ctx = canvas.getContext('2d');
    const image = await loadImage(src);

    ctx.drawImage(image, 0, 0, size.width, size.height);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const { width, height, data } = imageData;

    let outStr = '';

    for (let row = 0; row < height; row += 2) {
      for (let col = 0; col < width; col += 1) {
        const topIndex = ((row * width) + col) * 4;
        const bottomIndex = (((row + 1) * width) + col) * 4;
  
        const color = getColorBy(data, topIndex)('color');
        const bgColor = getColorBy(data, bottomIndex)('bgColor');

        outStr += `${bgColor}${color}▀${ansi16mClose.all}`
      }

      outStr += '\n';
    }

    console.log(outStr);
  });

program.parse();
