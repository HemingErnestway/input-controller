import { InputController } from "./input-controller.js";
import { MousePlugin } from "./plugins/mouse-plugin.js";

const inputController = new InputController({
    "left": { 
        keys: [37, 65],
        mouseButtons: [0],
    },
    "up": { 
        keys: [38, 87],
        mouseButtons: [],
    },
    "right": { 
        keys: [39, 68],
        mouseButtons: [2],
    },
    "down": { 
        keys: [40, 83],
        mouseButtons: [],
    },
});

inputController.addPlugins([
    new MousePlugin(),
]);

const box = document.querySelector("#box");

function attachBox() {
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
    const actionList = document.querySelector("#actions");
    actionList.innerHTML = "";

    Object.keys(inputController.getActions()).forEach(actionName => {
        actionList.innerHTML += `
            <li>
                <div class="wrapper">
                    <div>
                        <span id="action-${actionName}">${actionName}</span>
                        (<span id="status-${actionName}"></span>)
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
    })

    document.querySelector("#enable-controller").addEventListener("click", () => {
        inputController.enabled = true;
        updateStatuses();
    });

    document.querySelector("#disable-controller").addEventListener("click", () => {
        inputController.enabled = false;
        updateStatuses();
    });

    window.addEventListener("focus", () => {
        const focusedIndicator = document.querySelector("#window-focus");
        focusedIndicator.textContent = "focused";
        focusedIndicator.setAttribute("class", "good");
    });

    window.addEventListener("blur", () => {
        const focusedIndicator = document.querySelector("#window-focus");
        focusedIndicator.textContent = "unfocused";
        focusedIndicator.setAttribute("class", "bad");
    });
}

renderActionList();
addStatusListeners();

function updateActionActive(actionName) {
    document.querySelector(`#action-${actionName}`).setAttribute(
        "class", inputController.isActionActive(actionName) ? "active" : ""
    );
}

const coords = { x: 0, y: 0 };
const step = 5;

function moveBox() {
    box.style.backgroundColor = inputController.isActionActive("space") ? "red" : "black";

    const shift = { x: 0, y: 0 };

    if (inputController.isActionActive("left")) shift.x += -step;
    if (inputController.isActionActive("up")) shift.y += -step;
    if (inputController.isActionActive("right")) shift.x += step;
    if (inputController.isActionActive("down")) shift.y += step;

    if (shift.x !== 0 && shift.y !== 0) {
        shift.x /= Math.sqrt(2);
        shift.y /= Math.sqrt(2);
    }

    coords.x += shift.x;
    coords.y += shift.y;

    box.style.position = "absolute";
    box.style.left = `${coords.x}px`;
    box.style.top = `${coords.y}px`;

    requestAnimationFrame(moveBox);
}

requestAnimationFrame(moveBox);

box.addEventListener(inputController.ACTION_ACTIVATED, (e) => {
    console.log("activated", e.detail.action);
    updateActionActive(e.detail.action);
});

box.addEventListener(inputController.ACTION_DEACTIVATED, (e) => {
    console.log("deactivated", e.detail.action);
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

document.querySelector("#check-key").addEventListener("click", () => {
    console.log(`K is ${inputController.isKeyPressed(75) ? "" : "not "}pressed`);
});
