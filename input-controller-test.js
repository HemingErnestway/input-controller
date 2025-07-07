import { InputController } from "./input-controller.js";


const actions = {
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
};

const inputController = new InputController();
inputController.bindActions(actions);

function updateStatus(actionName) {
    const actionStatus = document.querySelector(`#status-${actionName}`);
    const enabled = actions[actionName].enabled ?? true;
    actionStatus.textContent = enabled ? " enabled" : "disabled";
    actionStatus.setAttribute("class", enabled ? "good" : "bad");
}

Object.keys(actions).forEach(actionName => {
    document.querySelector(`#enable-${actionName}`).addEventListener("click", () => {
        inputController.enableAction(actionName);
        Object.assign(actions[actionName], { enabled: true });
        updateStatus(actionName);
    });

    document.querySelector(`#disable-${actionName}`).addEventListener("click", () => {
        inputController.disableAction(actionName);
        Object.assign(actions[actionName], { enabled: false });
        updateStatus(actionName);
    });

    updateStatus(actionName);
});

const box = document.querySelector("#box");
inputController.attach(box);

const coords = { x: 0, y: 0 };
const step = 10;

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
