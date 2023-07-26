export const config = {
  fps: 30,
} as const;

export const screen = {
  w: process.stdout.columns,
  // color + bgColor
  h: process.stdout.rows * 2,
};

export const defaultSize = {
  w: screen.w,
  h: screen.h,
};
