import { InputController } from "./input-controller.js";

const inputController = new InputController({
    "left": { keys: [37, 65], enabled: false },
    "up": { keys: [38, 87] },
    "right": { keys: [39, 68] },
    "down": { keys: [40, 83] },
});

function attachBox() {
    const box = document.querySelector("#box");
    inputController.attach(box);
    return true;
}

function detachBox() {
    inputController.detach();
    return false;
}

let boxAttached = attachBox();

function updateStatus(element, enabled, goodMessage, badMessage) {
    element.textContent = enabled ? goodMessage : badMessage;
    element.setAttribute("class", enabled ? "good" : "bad");
}

function updateStatuses() {
    const actions = inputController.getActions();
    Object.keys(actions).forEach(actionName => {
        const actionStatus = document.querySelector(`#status-${actionName}`);
        const enabled = actions[actionName].enabled ?? true;
        updateStatus(actionStatus, enabled, "enabled", "disabled");
    });

    const statusAttached = document.querySelector("#status-attached");
    updateStatus(statusAttached, boxAttached, "attached", "detached");

    const statusEnabled = document.querySelector("#status-enabled");
    updateStatus(statusEnabled, inputController.enabled, "enabled", "disabled");
}

function renderActionList() {
    const actions = inputController.getActions();
    const actionList = document.querySelector("#actions");
    actionList.innerHTML = "";

    Object.keys(actions).forEach(actionName => {
        actionList.innerHTML += `
            <li>
                <div class="wrapper">
                    <div>
                        ${actionName} (<span id="status-${actionName}"></span>)
                        <span id="active-${actionName}"></span>
                    </div>
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

    document.querySelector("#attach-controller").addEventListener("click", () => {
        boxAttached = attachBox();
        updateStatuses();
    });

    document.querySelector("#detach-controller").addEventListener("click", () =>  {
        boxAttached = detachBox();
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

const coords = { x: 0, y: 0 };
const step = 10;

function updateActionActive(action) {
    const actionActive = document.querySelector(`#active-${action}`);
    actionActive.textContent = inputController.isActionActive(action) ? "A" : "";
}

box.addEventListener(inputController.ACTION_ACTIVATED, (e) => {
    updateActionActive(e.detail.action);

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
    updateActionActive(e.detail.action);
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
