import { resolve } from 'node:path';
import { existsSync, mkdirSync, readdirSync, unlinkSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { createCanvas, loadImage } from 'canvas';
import sizeOf from 'image-size';

import { config } from '../config.mjs';
import { _dirname } from '../constants.mjs';
import { getImageOutput } from './image.mjs';

import type { Options, Size } from '../type.mjs';

const imagesPath = resolve(_dirname, './images');
const sleep = (t: number) => new Promise((r) => setTimeout(() => r(undefined), t));

export async function video(
  filePath: string,
  { size, options }: { size: Size, options: Options }
) {
  if (!existsSync(imagesPath)) {
    mkdirSync(imagesPath);
  }

  const imgs = readdirSync(imagesPath);

  if (imgs.length !== 0) {
    imgs.map((img) => unlinkSync(resolve(imagesPath, img)));
  }

  execSync(`ffmpeg -i ${filePath} -f image2 -vf fps=fps=${config.fps} "${imagesPath}/video-%d.png"`, { stdio: 'inherit' });

  const outImgs = readdirSync(imagesPath);

  const count = outImgs.length;

  if (count === 0) {
    throw new Error('something went wrong');
  }

  // 💥 stack overflow with map

  let dimensions;
  let ctx;
  (async function inter(i: number) {
    if (i < count) {
      const start = Date.now();
      const imgPath = resolve(_dirname, `./images/video-${i}.png`);

      if (!dimensions) {
        dimensions = sizeOf(imgPath);
      }

      const image = await loadImage(imgPath);

      if (dimensions.width && dimensions.width < size.w) {
        size.w = dimensions.width;
      }
      const scale = dimensions.width ? size.w / dimensions.width : 1;
      size.h = dimensions.height ? Math.ceil(scale * dimensions.height) : size.h;

      if (!ctx) {
        const canvas = createCanvas(size.w, size.h);
        ctx = canvas.getContext('2d');
      }

      ctx.drawImage(image, 0, 0, size.w, size.h);
      const imageData = ctx.getImageData(0, 0, size.w, size.h);
      const outStr = getImageOutput(imageData, options);

      if (i === 1) {
        process.stdout.write('\u001b[2J');
      }
      process.stdout.write(`\u001b[H${outStr}`, async() => {
        const t = Date.now() - start;
        await sleep(config.fps - t);
        await inter(++i);
      });

      return;
    }

    // clear cache
    const cacheImgs = readdirSync(imagesPath);
    cacheImgs.map((img) => unlinkSync(resolve(imagesPath, img)));
  })(1);
}