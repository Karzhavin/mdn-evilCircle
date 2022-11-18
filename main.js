// setup canvas

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const count = document.querySelector('span');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

// function to generate random number

function random(min, max) {
  const num = Math.floor(Math.random() * (max - min + 1)) + min;
  return num;
}

// function to generate random color

function randomRGB() {
  return `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`;
}

class Shape {

  constructor(x, y, velX, velY) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
  }

  draw() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
  }

}

class EvilCircle extends Shape {

  constructor(x, y) {
    super(x, y, 20, 20);
    this.color = "white";
    this.size = 15;
    this.hunger = false;
  }

  draw() {
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.stroke();
  }

  checkBounds() {

  }

  controller(left, right, up, down, eat) {

    window.addEventListener("keydown", (event) => {

      switch (event.key) {
        case left:
          if ((this.x - this.size) >= 0) {
            this.x -= this.velX;
          }
          break;
        case right:
          if ((this.x + this.size) <= width) {
            this.x += this.velX;
          }
          break;
        case up:
          if ((this.y - this.size) >= 0) {
            this.y -= this.velY;
          }
          break;
        case down:
          if ((this.y + this.size) <= height) {
            this.y += this.velY;
          }
          break;
        case eat:
          this.hunger = true;
          this.color = "red";
          break;
      }

    });

    window.addEventListener("keyup", (event) => {

      if (event.key === eat) {
        evilCircle.hunger = false;
        evilCircle.color = "white";
      }

    });

  }

  collapseBall() {

    balls.forEach((ball, i) => {

      const dx = this.x - ball.x;
      const dy = this.y - ball.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.size + ball.size && this.hunger) {
        balls.splice(i, 1);
        this.size += 1;
        this.velX += 1;
        this.velY += 1;
      }

    });

  }

}

class Ball extends Shape {

  constructor(x, y, velX, velY, color, size) {
    super(x, y, velX, velY);
    this.color = color;
    this.size = size;
  }

  update() {
    if ((this.x + this.size) >= width) {
      this.velX = -(this.velX);
    }

    if ((this.x - this.size) <= 0) {
      this.velX = -(this.velX);
    }

    if ((this.y + this.size) >= height) {
      this.velY = -(this.velY);
    }

    if ((this.y - this.size) <= 0) {
      this.velY = -(this.velY);
    }

    this.x += this.velX;
    this.y += this.velY;
  }

  collisionDetect() {
    for (const ball of balls) {
      if (this !== ball) {
        const dx = this.x - ball.x;
        const dy = this.y - ball.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.size + ball.size) {
          let storeX = this.velX;
          let storeY = this.velY;
          this.velX = ball.velX;
          this.velY = ball.velY;
          ball.velX = storeX;
          ball.velY = storeY;

        }
      }
    }
  }

}

const balls = [];

while (balls.length < 25) {
  const size = random(10, 20);
  const ball = new Ball(
    // ball position always drawn at least one ball width
    // away from the edge of the canvas, to avoid drawing errors
    random(0 + size, width - size),
    random(0 + size, height - size),
    random(-7, 7),
    random(-7, 7),
    randomRGB(),
    size
  );

  balls.push(ball);
}

const evilCircle = new EvilCircle(100, height - 100);
evilCircle.controller("a", "d", "w", "s", " ");

function loop() {

  ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
  ctx.fillRect(0, 0, width, height);

  count.textContent = `${balls.length}`

  for (const ball of balls) {
    ball.draw();
    ball.update();
    ball.collisionDetect();
  }

  evilCircle.draw();
  evilCircle.collapseBall();

  requestAnimationFrame(loop);
}

loop();
