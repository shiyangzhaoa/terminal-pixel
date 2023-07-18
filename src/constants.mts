import { dirname } from 'node:path';

export enum TypeEnum {
  pixel,
  game,
}

export const _dirname = dirname(new URL(import.meta.url).pathname);
