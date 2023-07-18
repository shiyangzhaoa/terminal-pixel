import { resolve } from 'node:path';
import { readdirSync } from 'node:fs';
import { select } from '@inquirer/prompts';

import { _dirname } from '../constants.mjs';
import { snake } from './games/index.mjs';

const gamesPath = resolve(_dirname,  './game-center/games');
const gameMap = { snake };

export async function gameCenter() {
  const games = readdirSync(gamesPath, { withFileTypes: true }).filter((dirent) => dirent.isDirectory());

  if (games.length === 0) {
    console.log('Something went wrong.');
  }

  const name = await select({
    message: 'Choose the game you want to play.',
    choices: games.map((dirent) => ({
      name: dirent.name,
      value: dirent.name as keyof typeof gameMap,
      description: 'enter to play'
    }))
  });

  gameMap[name]();
}