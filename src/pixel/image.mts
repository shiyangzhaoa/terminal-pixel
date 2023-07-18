import { renderImageData } from "../render.mjs";

import type { ImageData } from "canvas";
import type { Options } from "../type.mjs";

export function getImageOutput(imageData: ImageData, options: Options) {
  let outStr = '';

    if (options.disableLinewrap)
      outStr += '\u001B[?7l'; // https://espterm.github.io/docs/VT100%20escape%20codes.html

    outStr = renderImageData(imageData)(outStr);

    if (options.disableLinewrap)
      outStr += '\u001B[?7h'; // Restore line wrapping

    return outStr;
}