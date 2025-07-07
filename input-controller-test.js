import { InputController } from "./input-controller.js";

const inputController = new InputController();

inputController.bindActions({
    "left": {
        keys: [37, 65],
        enabled: false,
    },
    "up": {
        keys: [38, 87],
    },
    "right": {
        keys: [39, 68],
    },
    "down": {
        keys: [40, 83],
    },
});

const box = document.querySelector("#box");

// document.addEventListener("keydown", (e) => console.log(e.keyCode))

inputController.attach(box);

const coords = { x: 0, y: 0 };
const step = 50;

box.addEventListener(inputController.ACTION_ACTIVATED, (e) => {
    const shift 
        = e.detail.action === "left" ? { x: -step, y: 0 }
        : e.detail.action === "up" ? { x: 0, y: -step }
        : e.detail.action === "right" ? { x: step, y: 0 }
        : e.detail.action === "down" ? { x: 0, y: step }
        : { x: 0, y: 0 };

    coords.x += shift.x;
    coords.y += shift.y;

    box.style.position = "absolute";
    box.style.left = `${coords.x}px`;
    box.style.top = `${coords.y}px`;
});

box.addEventListener(inputController.ACTION_DEACTIVATED, (e) => {
    // console.log(e.detail);
});
