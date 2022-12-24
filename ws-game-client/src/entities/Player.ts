import { PlayerState } from "../shared/dtos";
import Ball from "./Ball";
import Entity from "./Entity";

export default class Player extends Entity {
  direction = {
    x: 0,
    y: 0,
  };
  constructor(playerRef: HTMLDivElement, state: PlayerState) {
    super(playerRef);
    this.state = state;
  }

  move(x: number, y: number) {
    // this.direction = {
    //   x: Math.sign(x),
    //   y: Math.sign(y),
    // };
    // this.x += x;
    // this.y += y;

    const newState: PlayerState = {
      ...this.state,
      direction: { x: Math.sign(x), y: Math.sign(y) },
      x: this.x + x,
      y: this.y + y,
    };

    return newState;
  }

  intersectsBall(ball: Ball) {
    return (
      ball.center.x > this.x &&
      ball.center.y > this.y &&
      ball.center.x < this.x + this.width &&
      ball.center.y < this.y + this.height
    );
  }

  get name() {
    return this.getProperty("--name", { parse: (v) => v });
  }
  set name(val) {
    this.setProperty("--name", val);
    this.ref.setAttribute("data-name", val);
  }
  get avatar() {
    return this.getProperty("--avatar", { parse: (v) => v });
  }
  set avatar(val) {
    this.setProperty(
      "background-image",
      `url("src/assets/avatars/${val}.png")`
    );
    // this.ref.setAttribute("data-avatar", val);
  }
  get score() {
    return this.getProperty("--score", { parse: (v) => parseFloat(v) });
  }
  set score(val) {
    this.setProperty("--score", val);
  }

  setScore(s: number, update: boolean = true) {
    this.score = update ? this.score + s : s;
    this.width++;
    this.height++;
  }

  get state() {
    return {
      name: this.name,
      avatar: this.avatar,
      color: this.color,
      score: this.score,
      x: this.x,
      y: this.y,
      height: this.height,
      width: this.width,
      direction: this.direction,
    };
  }
  set state(state: PlayerState) {
    if (!state) return;
    this.name = state.name;
    this.avatar = state.avatar;
    this.color = state.color;
    this.score = state.score;
    this.x = state.x;
    this.y = state.y;
    this.height = state.height;
    this.width = state.width;
    this.direction = state.direction;
  }
}
