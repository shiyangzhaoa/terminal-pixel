import path from 'node:path';

export const isImage = (src: string) => {
  const extension = path.extname(src).toLowerCase();

  return extension  === '.jpeg' || extension === '.jpg' || extension === '.png' || extension === '.svg';
};

export const isVideo = (src: string) => {
  const extension = path.extname(src).toLowerCase();

  return extension  === '.mp4' || extension === '.mov'|| extension === '.avi' || extension  === '.flv' || extension  === '.mkv'
};