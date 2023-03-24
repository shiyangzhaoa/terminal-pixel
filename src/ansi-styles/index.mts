const ANSI_BACKGROUND_OFFSET = 10;

export const wrapAnsi16 = (offset = 0) => (code: number) => `\u001B[${code + offset}m`;

export const wrapAnsi256 = (offset = 0) => (code: number) => `\u001B[${38 + offset};5;${code}m`;

export const wrapAnsi16m = (offset = 0) => (red: number, green: number, blue: number) => `\u001B[${38 + offset};2;${red};${green};${blue}m`;

const colorOpen = wrapAnsi16m();
const bgColorOpen = wrapAnsi16m(ANSI_BACKGROUND_OFFSET);

export const ansi16mOpen = {
  color: colorOpen,
  bgColor: bgColorOpen
};

export const colorClose = '\u001B[39m';
export const bgColorClose = '\u001B[49m';
export const allClose = '\u001B[0m';

export const rgbToAnsi256 = (red: number, green: number, blue: number) => {
  if (red === green && green === blue) {
    if (red < 8) {
      return 16;
    }

    if (red > 248) {
      return 231;
    }

    return Math.round(((red - 8) / 247) * 24) + 232;
  }

  return 16
    + (36 * Math.round(red / 255 * 5))
    + (6 * Math.round(green / 255 * 5))
    + Math.round(blue / 255 * 5);
};

export const ansi16mClose = {
  color: colorClose,
  bgColor: bgColorClose,
  all: allClose,
};