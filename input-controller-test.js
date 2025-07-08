import { InputController } from "./input-controller.js";

const keyNames = {
    32: "Space",
    37: "ArrLeft",
    38: "ArrUp",
    39: "ArrRight",
    40: "ArrDown",
    65: "A",
    68: "W",
    83: "D",
    87: "S",
};

const inputController = new InputController({
    "left": { keys: [37, 65] },
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

function renderKeyList() {
    const keyList = document.querySelector("#keys");
    keyList.innerHTML = "";
    
    Object.keys(inputController.getKeys()).forEach(key => {
        keyList.innerHTML += `
            <li>
                <span id="key-${key}">${keyNames[key]}</span> 
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
renderKeyList();
addStatusListeners();

function updateActionActive(actionName) {
    document.querySelector(`#action-${actionName}`).setAttribute(
        "class", inputController.isActionActive(actionName) ? "active" : ""
    );
}

function updateKeyActive(keyCode) {
    document.querySelector(`#key-${keyCode}`).setAttribute(
        "class", inputController.isKeyPressed(keyCode) ? "active" : ""
    );
}

const coords = { x: 0, y: 0 };
const step = 5;

const moving = {
    "left": 0,
    "up": 0,
    "right": 0,
    "down": 0,
};

function isMoving() {
    const res = !Object.values(moving).every(value => value === 0);
    console.log(res)
    console.log(Object.values(moving))
    return res;
}

function moveBox() {
    // if (!isMoving()) return;

    // if (action === "space") {
    //     box.style.backgroundColor = box.style.backgroundColor === "red" ? "black" : "red";
    //     return;
    // }

    // console.log(inputController.isActionActive(action), action)

    const shift = { x: 0, y: 0 };

    if (inputController.isActionActive("left")) shift.x += -step;
    if (inputController.isActionActive("up")) shift.y += -step;
    if (inputController.isActionActive("right")) shift.x += step;
    if (inputController.isActionActive("down")) shift.y += step;

    coords.x += shift.x;
    coords.y += shift.y;

    box.style.position = "absolute";
    box.style.left = `${coords.x}px`;
    box.style.top = `${coords.y}px`;

    requestAnimationFrame(moveBox);
}

requestAnimationFrame(moveBox);

box.addEventListener(inputController.ACTION_ACTIVATED, (e) => {
    moving[e.detail.action] += 1;
    updateActionActive(e.detail.action);
    updateKeyActive(e.detail.keyCode);
});

box.addEventListener(inputController.ACTION_DEACTIVATED, (e) => {
    moving[e.detail.action] -= 1;
    updateActionActive(e.detail.action);
    updateKeyActive(e.detail.keyCode);
});

document.querySelector("#bind-space").addEventListener("click", () => {
    inputController.bindActions({
        "space": {
            keys: [32],
        }
    });
    renderActionList();
    renderKeyList();
    addStatusListeners();
});
