import { Command } from 'commander';
import { select } from '@inquirer/prompts';

import { TypeEnum } from './constants.mjs';
import { Options } from './type.mjs';
import { pixel } from './pixel/index.mjs';
import { gameCenter } from './game-center/index.mjs';

const program = new Command();

program
  .name('terminal-pixel')
  .description('Render pixel in your terminal')
  .version('1.1.2');

program
  .option('--disable-linewrap', 'disable linewrap')
  .action(async (options: Options) => {
    const type = await select({
      message: 'Please select the module you want to enter.',
      choices: [
        {
          name: 'Pixel Center',
          value: TypeEnum.pixel,
          description: 'render image or video in your terminal',
        },
        {
          name: 'Game Center',
          value: TypeEnum.game,
          description: 'play game in your terminal',
        },
      ],
    });

    if (type === TypeEnum.pixel) {
      try {
        await pixel(options);
      } catch(err) {
        console.log((err as Error).message || 'Something went wrong');
      }
    }

    if (type === TypeEnum.game) {
      try {
        await gameCenter();
      } catch (err) {
        console.log((err as Error).message || 'Something went wrong');
      }
    }
  });

program.parse();
