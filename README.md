# terminal-pixel

Render Pixel in Your Terminal

<p>
  <img src="./logo.svg" alt="Terminal Pixel">
</p>
<p>
    <a href="https://www.npmjs.com/package/terminal-pixel"><img src="https://img.shields.io/npm/dm/terminal-pixel?style=flat-square" alt="Total Downloads"></a>
    <a href="https://www.npmjs.com/package/terminal-pixel"><img src="https://img.shields.io/bundlephobia/minzip/terminal-pixel?style=flat-square" alt="Latest Release"></a>
    <a href="https://github.com/shiyangzhaoa/terminal-pixel/blob/main/LICENSE"><img src="https://shields.io/github/license/shiyangzhaoa/terminal-pixel?style=flat-square" alt="License"></a>
</p>

## Example

<p>
  <img src="./example.jpg" alt="Example">
</p>

## Install

```shell
npm install terminal-pixel -g
```

## How to use

```shell
terminal-pixel xxx.png
// or npx terminal-pixel xxx.png
```

## Options

### Size

```shell
terminal-pixel xxx.png -s 40
// render size: 40 * 40
```

### Width

```shell
terminal-pixel xxx.png -w 40
// render size: 40 * image.height
```

### Height

```shell
terminal-pixel xxx.png -h 40
// render size: image.width * 40
```
