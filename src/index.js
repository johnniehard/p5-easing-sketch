import p5 from "p5";
import { easeCubic } from "d3-ease";
import { scaleLinear } from "d3-scale";
import "./styles.css";

const debug = false;

let bars = [];
let nBars = 10;

const color = scaleLinear()
  .domain([0, nBars * 0.5, nBars])
  .range(["brown", "red", "orange"]);

function ease(duration) {
  const start = new Date().getTime();
  return () => {
    let elapsed = new Date().getTime() - start;
    if (elapsed > duration) {
      elapsed = duration;
    }
    let t = elapsed / duration;
    return easeCubic(t);
  };
}

function Bar(s, n) {
  this.width = 30;
  this.duration = 300;
  this.color = color(n);
  this.e = ease(this.duration);
  this.xval = s.width / 2; // - this.width / 2;
  this.yval = s.height / 2;
  this.nextX = this.xval;
  this.nextY = this.yval;
  this.x = this.xval;
  this.y = this.yval;

  this.update = () => {
    this.x = this.xval + (this.nextX - this.xval) * this.e();
    this.y = this.yval + (this.nextY - this.yval) * this.e();
    if (this.x === this.nextX) this.xval = this.nextX;
    if (this.y === this.nextY) this.yval = this.nextY;
  };

  this.draw = () => {
    s.noStroke();
    s.fill(this.color);
    // s.rect(this.x - this.width / 2, s.height - this.y, 30, this.y);
    s.ellipse(this.x, s.height - this.y, 30, 30);

    if (debug) {
      s.stroke(255, 0, 0);
      s.line(this.xval, 0, this.xval, s.height);
      s.stroke(0, 0, 255);
      s.line(this.nextX, 0, this.nextX, s.height);
    }
  };

  this.newVal = (x, y) => {
    this.xval = this.xval + (this.nextX - this.xval) * this.e();
    this.yval = this.yval + (this.nextY - this.yval) * this.e();
    this.e = ease(this.duration);
    this.nextX = x;
    this.nextY = y;
  };
}

let sketch = s => {
  s.setup = () => {
    s.createCanvas(500, 500);
    s.background(0);
    for (let i = 0; i < nBars; i++) {
      bars.push(new Bar(s, i));
    }
  };

  s.draw = () => {
    s.background(0);
    bars.forEach(bar => bar.update());
    bars.forEach(bar => bar.draw());
  };

  let n = 0;
  s.mouseClicked = () => {
    n += 1;
    bars.forEach((bar, j) => {
      setTimeout(() => {
        let x = Math.random() * s.width;
        let y = Math.random() * s.height;
        if (n % 5 === 0) {
          x = s.width / 2; // - bar.width / 2;
          y = s.height / 2;
        }
        bar.newVal(x, y);
      }, j * 1);
    });
  };

  s.mouseMoved = () => {
    // s.mouseClicked()
  };
};

const P5 = new p5(sketch);
