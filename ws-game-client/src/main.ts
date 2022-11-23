import { KEYS } from "./constants/keys";
import { minimap } from "./globals";
import { socket } from "./services/socket";
import { getBall, getPlayer, IOpponents, opponents } from "./services/store";
import "./styles/index.css";
import "./styles/collabsible.css";
import "./styles/menubar.css";
import "./styles/minimap.css";
import Player from "./entities/Player";

const update: FrameRequestCallback = () => {
  const player = getPlayer();
  const ball = getBall();

  // Ball intersection
  if (player && ball && player.intersectsBall(ball)) {
    socket.emit("intersect_ball", player.state);
  }

  // // Player intersection
  // if (player && opponents) {
  //   Object.entries(opponents).forEach(([_oppId, opp]) => {
  //     if (player.intersectsOpponent(opp)) {
  //       player.move(
  //         -opp.width * player.direction.x,
  //         -opp.height * player.direction.y
  //       );
  //     }
  //   });
  // }

  // Scroll on move
  if (player) {
    const {
      top: playerTop,
      left: playerLeft,
      height: playerHeight,
      width: playerWidth,
    } = player.ref.getBoundingClientRect();

    const scrollTop = document.documentElement.scrollTop;
    const scrollLeft = document.documentElement.scrollLeft;

    const idealPlayerTop = window.innerHeight / 2 - playerHeight;
    const idealPlayerLeft = window.innerWidth / 2 - playerWidth;

    const idealScrollTop = playerTop + scrollTop - idealPlayerTop;
    const idealScrollLeft = playerLeft + scrollLeft - idealPlayerLeft;

    document.documentElement.scrollTop = idealScrollTop;
    document.documentElement.scrollLeft = idealScrollLeft;
  }

  // minimap
  if (player && ball) {
    const dx = ball.x - player.x;
    const dy = ball.y - player.y;

    const theta = Math.atan2(dy, dx);
    const r = minimap.ref.offsetHeight / 2;
    const top = r * Math.sin(theta) + r - 10;
    const left = r * Math.cos(theta) + r - 10;
    minimap.ballTop = top;
    minimap.ballLeft = left;
  }
  requestAnimationFrame(update);
};
requestAnimationFrame(update);

document.addEventListener("keydown", async (e) => {
  e.preventDefault();
  const player = getPlayer();
  if (!player) return;

  const speed = e.shiftKey ? 4 : 2;

  const { x, y } = getMoveDirection(e.key);

  for (let i = 0; i < speed; i++) {
    player.move(x, y);
    if (ifPlayerIntersectsOpponents(player, opponents)) {
      player.move(-x * 2 * speed, -y * 2 * speed);
      // player.move(-x, -y);
    }
  }

  // await new Promise((resolve) => setTimeout(resolve, 200));
});

const ifPlayerIntersectsOpponents = (player: Player, opponents: IOpponents) => {
  if (opponents) {
    for (let opp in opponents) {
      if (player.intersectsOpponent(opponents[opp])) {
        return true;
      }
    }
  }
  return false;
};

const getMoveDirection = (key: string) => {
  switch (key) {
    case KEYS.ArrowLeft:
      return { x: -1, y: 0 };

    case KEYS.ArrowRight:
      return { x: 1, y: 0 };

    case KEYS.ArrowUp:
      return { x: 0, y: -1 };

    case KEYS.ArrowDown:
      return { x: 0, y: 1 };

    default:
      return { x: 0, y: 0 };
  }
  // if (e.key === KEYS.ArrowLeft) {
  //   player.move(-speed, 0);
  // }
  // if (e.key === KEYS.ArrowRight) {
  //   player.move(speed, 0);
  // }
  // if (e.key === KEYS.ArrowUp) {
  //   player.move(0, -speed);
  // }
  // if (e.key === KEYS.ArrowDown) {
  //   player.move(0, +speed);
  // }
};
