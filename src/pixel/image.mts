import { image2ascii, renderImageData } from "../render.mjs";
import { PixelEnum } from "../constants.mjs";

import type { ImageData } from "canvas";
import type { Options } from "../type.mjs";

export function getImageOutput(imageData: ImageData, options: Options, pixel: PixelEnum) {
  // cursor show/hidden
  let outStr = '\u001B[?25l';

    if (options.disableLinewrap)
      outStr += '\u001B[?7l'; // https://espterm.github.io/docs/VT100%20escape%20codes.html

    outStr = pixel === PixelEnum.lattice ? renderImageData(imageData)(outStr) : image2ascii(imageData)(outStr);

    if (options.disableLinewrap)
      outStr += '\u001B[?7h'; // Restore line wrapping
    outStr += '\u001B[?25h'

    return outStr;
}