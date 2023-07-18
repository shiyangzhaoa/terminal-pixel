import { ImageData } from "canvas";

import { screen } from "../../../config.mjs";
import { renderImageData } from "../../../render.mjs";

enum Direction {
  Left,
  Right,
  Up,
  Down,
}

const color = {
  grey: [198, 198, 198, 255],
  red: [222, 64, 29, 255],
  black: [51, 51, 51, 255],
};

const keyboard = {
  esc: '\u001b',
  ArrowUp: '\u001b[A',
  ArrowDown: '\u001b[B',
  ArrowLeft: '\u001b[D',
  ArrowRight: '\u001b[C',
};

class SnakeBody {
  snake: Snake;
  x: number;
  y: number;

  constructor(snake: Snake, x: number, y: number) {
    this.snake = snake;
    this.x = x;
    this.y = y;
  }

  move(direction: Direction) {
    switch (direction) {
      case Direction.Up: --this.y; break;
      case Direction.Down: ++this.y; break;
      case Direction.Left: --this.x; break;
      case Direction.Right: ++this.x; break;
    }
  }

  checkValid() {
    return this.snake.body.every(that => this === that || !this.isSamePlace(that))
      && (this.x > 0 && this.x < this.snake.game.width - 1)
      && (this.y > 0 && this.y < this.snake.game.height - 1)
  }

  isSamePlace(that: SnakeBody | null) {
    return this.x === that?.x && this.y === that.y;
  }
}

class Snake {
  body: SnakeBody[];
  food: SnakeBody | null = null;
  direction!: Direction;
  nextDirection: Direction;
  game: {
    width: number;
    height: number;
  };
  timeoutHandle?: NodeJS.Timeout;

  constructor(defaultDirection = Direction.Right) {
    this.game = {
      width: screen.w,
      height: screen.h,
    };

    const { width, height } = this.game;

    this.body = [
      new SnakeBody(this, (width / 2 - 3) | 0, (height / 2) | 0),
      new SnakeBody(this, (width / 2 - 2) | 0, (height / 2) | 0),
      new SnakeBody(this, (width / 2 - 1) | 0, (height / 2) | 0),
    ];

    // addEventListener('keydown', e => {
    //   switch (e.key) {
    //     case 'ArrowDown':
    //       if (this.direction !== Direction.Up) this.nextDirection = Direction.Down;
    //       e.preventDefault();
    //       break;
    //     case 'ArrowUp':
    //       if (this.direction !== Direction.Down) this.nextDirection = Direction.Up;
    //       e.preventDefault();
    //       break;
    //     case 'ArrowLeft':
    //       if (this.direction !== Direction.Right) this.nextDirection = Direction.Left;
    //       e.preventDefault();
    //       break;
    //     case 'ArrowRight':
    //       if (this.direction !== Direction.Left) this.nextDirection = Direction.Right;
    //       e.preventDefault();
    //       break;
    //   }
    // });

    this.nextDirection = defaultDirection;

    this.addEventListener();
  }

  addEventListener() {
    const stdin = process.stdin;
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding('utf8');
    stdin.on('data', (key) => {
      if (JSON.stringify(key) === JSON.stringify(keyboard.esc)) {
        this.exit();

        return;
      }

      switch (JSON.stringify(key)) {
        case JSON.stringify(keyboard.ArrowDown):
          if (this.direction !== Direction.Up) this.nextDirection = Direction.Down;
          break;
        case JSON.stringify(keyboard.ArrowUp):
          if (this.direction !== Direction.Down) this.nextDirection = Direction.Up;
          break;
        case JSON.stringify(keyboard.ArrowLeft):
          if (this.direction !== Direction.Right) this.nextDirection = Direction.Left;
          break;
        case JSON.stringify(keyboard.ArrowRight):
          if (this.direction !== Direction.Left) this.nextDirection = Direction.Right;
          break;
        default:
          return;
      }
    });
  }

  exit() {
    clearTimeout(this.timeoutHandle);
    process.stdin.removeAllListeners();
    process.exit(0);
  }

  move() {
    const head = this.head;
    let newHead: SnakeBody;

    switch (this.direction = this.nextDirection) {
      case Direction.Up: newHead = new SnakeBody(this, head.x, head.y - 1); break;
      case Direction.Down: newHead = new SnakeBody(this, head.x, head.y + 1); break;
      case Direction.Left: newHead = new SnakeBody(this, head.x - 1, head.y); break;
      case Direction.Right: newHead = new SnakeBody(this, head.x + 1, head.y); break;
    }

    if (this.food) {
      if (newHead.isSamePlace(this.food)) {
        this.food = null;
      } else {
        this.body.shift();
      }
    }

    this.body.push(newHead);
  }

  checkValid() {
    return this.head.checkValid();
  }

  get head() {
    return this.body[this.body.length - 1];
  }

  get tail() {
    return this.body[0];
  }

  generateFood() {
    do {
      this.food = new SnakeBody(this,
        Math.random() * (this.game.width - 1) | 0,
        Math.random() * (this.game.height - 1) | 0);
    } while (this.body.some(x => x.isSamePlace(this.food)));
  }

  draw(cb: () => void) {
    const list = new Array(this.game.width * this.game.height).fill(color.grey).flat();

    const draw = (x: number, y: number, c: number[]) => {
      const index = (y * this.game.width + x) * 4;
      list[index] = c[0];
      list[index + 1] = c[1];
      list[index + 2] = c[2];
    };

    this.body.forEach((p) => {
      const { x, y } = p;
      draw(x, y, color.black);
    });

    if (!this.food) return;

    draw(this.food.x, this.food.y, color.red);

    const imageData: ImageData = {
      width: this.game.width,
      height: this.game.height,
      data: new Uint8ClampedArray(list),
    };

    const outputStr = renderImageData(imageData)();
    process.stdout.write(`\u001B[?25l${outputStr}\u001B[?25h`, () => {
      cb();
    });
  }

  run() {
    this.move();
    if (!this.food) this.generateFood();
    this.draw(() => {
      this.timeoutHandle = setTimeout(() => this.run(), 200);
    });
    if (!this.checkValid()) {
      console.log(`Your score: ${this.body.length - 4}`);
      this.exit();

      return;
    }
  }
}

export function snake(){
  new Snake().run();
}