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

function updateStatuses() {
    const actions = inputController.getActions();
    Object.keys(inputController.getActions()).forEach(actionName => {
        const actionStatus = document.querySelector(`#status-${actionName}`);
        const enabled = actions[actionName].enabled ?? true;
        actionStatus.textContent = enabled ? "enabled" : "disabled";
        actionStatus.setAttribute("class", enabled ? "good" : "bad");
    });

    const statusAttached = document.querySelector("#status-attached");
    // ...

    const statusEnabled = document.querySelector("#status-enabled");
    statusEnabled.textContent = inputController.enabled ? "enabled" : "disabled";
    statusEnabled.setAttribute("class", inputController.enabled ? "good" : "bad");
}

function renderActionList() {
    const actions = inputController.getActions();
    const actionList = document.querySelector("#actions");
    actionList.innerHTML = "";

    Object.keys(actions).forEach(actionName => {
        actionList.innerHTML += `
            <li>
                <div class="wrapper">
                    <div>${actionName} (<span id="status-${actionName}"></span>)</div>
                    <div>
                        <button id="enable-${actionName}">enable</button>
                        <button id="disable-${actionName}">disable</button>
                    </div>
                </div>
            </li>
        `;
    });
}

function addStatusListeners() {
    Object.keys(inputController.getActions()).forEach(actionName => {
        document.querySelector(`#enable-${actionName}`).addEventListener("click", () => {
            inputController.enableAction(actionName);
            inputController.bindActions({ 
                [actionName]: { 
                    keys: inputController.getActions()[actionName].keys,
                    enabled: true,
                }
            });
            updateStatuses();
        });

        document.querySelector(`#disable-${actionName}`).addEventListener("click", () => {
            inputController.disableAction(actionName);
            inputController.bindActions({ 
                [actionName]: { 
                    keys: inputController.getActions()[actionName].keys,
                    enabled: false,
                }
            });
            updateStatuses();
        });

        updateStatuses();
    });

    document.querySelector("#enable-controller").addEventListener("click", () => {
        inputController.enabled = true;
        updateStatuses();
    });

    document.querySelector("#disable-controller").addEventListener("click", () => {
        inputController.enabled = false;
        updateStatuses();
    });
}

renderActionList();
addStatusListeners();

const box = document.querySelector("#box");
inputController.attach(box);

const coords = { x: 0, y: 0 };
const step = 10;

box.addEventListener(inputController.ACTION_ACTIVATED, (e) => {
    if (e.detail.action === "space") {
        box.style.backgroundColor = box.style.backgroundColor === "red" ? "black" : "red";
        return;
    }

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

document.querySelector("#bind-space").addEventListener("click", () => {
    inputController.bindActions({
        "space": {
            keys: [32],
        }
    });
    renderActionList();
    addStatusListeners();
});

// document.addEventListener("keydown", (e) => console.log(e.keyCode))
