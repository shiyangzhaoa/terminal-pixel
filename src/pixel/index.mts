import fs from 'node:fs';
import { createCanvas, loadImage } from 'canvas';
import { input } from '@inquirer/prompts';
import sizeOf from 'image-size';

import { isImage, isVideo } from '../validators/fs.mjs';
import { defaultSize } from '../config.mjs';
import { getImageOutput } from './image.mjs';
import { video } from './video.mjs';

import type { Options } from '../type.mjs';

export async function pixel(options: Options) {
  try {
    const _src = await input({
      message: 'Enter your file path',
      validate: async (_src) => {
        const src= _src.trim();
        try {
          fs.accessSync(src)
        } catch {
          return Promise.reject(`no such file: ${src}`);
        }

        return (isImage(src) || isVideo(src)) ? true : 'Please check the file extension';
      },
    });
    const src= _src.trim();

    const size = {
      w: defaultSize.w,
      h: defaultSize.h,
    };

    if (isImage(src)) {
      const dimensions = sizeOf(src);

      const scale = dimensions.width ? size.w / dimensions.width : 1;
      size.h = dimensions.height ? Math.ceil(scale * dimensions.height) : size.h;

      const canvas = createCanvas(size.w, size.h);
      const ctx = canvas.getContext('2d');

      const image = await loadImage(src);
      ctx.drawImage(image, 0, 0, size.w, size.h);
      const imageData = ctx.getImageData(0, 0, size.w, size.h);

      const outStr = getImageOutput(imageData, options);
      process.stdout.write(outStr);

      return;
    }

    if (isVideo(src)) {
      video(src, { size, options });

      return;
    }

    throw new Error('something went wrong');
  } catch {
    console.log('Please check your input');
  }
}