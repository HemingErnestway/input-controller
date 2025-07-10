// @ts-check
export class ControllerPlugin {
    /** @type {string} */ name;
    /** @type {string} */ keysPropertyName;
    /** @type {string} */ actionActivated;
    /** @type {string} */ actionDeactivated;

    /** 
     * @typedef {object} Action
     * @property {number[]} keys
     * @property {boolean} enabled
     * @property {boolean} active
     */ 
    /** @type {Object.<string, Action>} */ actions = {};

    /** @type {Object.<string, Set<number>>} */ actionKeys = {};
    /** @type {Object.<string, EventListener>} */ controllerListeners = {};

    /** 
     * @param {string} actionName 
     * @param {number[]} keys 
     * @param {boolean} enabled 
     * @param {boolean} active 
     * @param {string} actionActivated 
     * @param {string} actionDeactivated 
     */
    initAction(actionName, keys, enabled, active, actionActivated, actionDeactivated) {
        this.actions[actionName] = { keys, enabled, active };
        this.actionKeys[actionName] = new Set();
        this.actionActivated = actionActivated;
        this.actionDeactivated = actionDeactivated;
    }

    /**
     * @param {string} actionName 
     */
    enableAction(actionName) {
        this.actions[actionName].enabled = true;
    }

    /**
     * @param {string} actionName 
     */
    disableAction(actionName) {
        this.actions[actionName].enabled = false;
    }

    /**
     * @param {Event} e 
     * @param {string} actionEvent 
     * @param {HTMLElement} target 
     */
    actionHandler = (e, actionEvent, target) => {
    };

    /**
     * @param {string} event 
     * @param {string} actionEvent 
     * @param {HTMLElement} target 
     */
    addControllerListener = (event, actionEvent, target) => {
        if (this.controllerListeners[event]) return; 

        const listener = (/** @type {Event} */ e) => {
            this.actionHandler(e, actionEvent, target)
        };

        this.controllerListeners[event] = listener;
        document.addEventListener(event, listener);
    };

    /**
     * @param {string} event 
     */
    removeControllerListener = (event) => {
        if (this.controllerListeners[event]) {
            document.removeEventListener(event, this.controllerListeners[event]);
            delete this.controllerListeners[event];
        }
    };

    /**
     * @param {HTMLElement} target 
     */
    attachControllerListeners(target) {
    }

    detachControllerListeners() {
    }
}

export class KeyboardPlugin extends ControllerPlugin {
    name = "keyboard";
    keysPropertyName = "keys";

    /**
     * @param {*} e 
     * @param {string} actionEvent 
     * @param {HTMLElement} target 
     */
    actionHandler = (e, actionEvent, target) => {
        const actionName = Object.keys(this.actions).find(actionName => 
            this.actions[actionName].keys.includes(e.keyCode)
        );

        // TODO: add InputController.enabled check somehow
        if (actionName === undefined || !this.actions[actionName].enabled) {
            return;
        }

        if (actionEvent === this.actionDeactivated) {
            this.actionKeys[actionName].delete(e.keyCode);
            if (this.actionKeys[actionName].size === 0) {
                this.actions[actionName].active = false;
            }
        }

        if (actionEvent === this.actionActivated) {
            this.actionKeys[actionName].add(e.keyCode);
        }

        if (this.actions[actionName].active) return;
        
        if (actionEvent === this.actionActivated) {
            this.actions[actionName].active = true;
        }

        target.dispatchEvent(
            new CustomEvent(actionEvent, {
                detail: { 
                    action: actionName,
                    enabled: this.actions[actionName].enabled,
                },
            })
        );
    }

    /**
     * @param {HTMLElement} target 
     */
    attachControllerListeners(target) {
        this.addControllerListener("keydown", this.actionActivated, target);
        this.addControllerListener("keyup", this.actionDeactivated, target);
    }

    detachControllerListeners() {
        this.removeControllerListener("keydown");
        this.removeControllerListener("keyup");
    }
}

export class MousePlugin extends ControllerPlugin {
    name = "mouse";
    keysPropertyName = "mouseButtons";

    /**
     * @param {*} e 
     * @param {string} actionEvent 
     * @param {HTMLElement} target 
     */
    actionHandler = (e, actionEvent, target) => {
        const actionName = Object.keys(this.actions).find(actionName => 
            this.actions[actionName].keys.includes(e.button)
        );

        // TODO: add InputController.enabled check somehow
        if (actionName === undefined || !this.actions[actionName].enabled) {
            return;
        }

        if (actionEvent === this.actionDeactivated) {
            this.actionKeys[actionName].delete(e.button);
            if (this.actionKeys[actionName].size === 0) {
                this.actions[actionName].active = false;
            }
        }

        if (actionEvent === this.actionActivated) {
            this.actionKeys[actionName].add(e.button);
        }

        if (this.actions[actionName].active) return;
        
        if (actionEvent === this.actionActivated) {
            this.actions[actionName].active = true;
        }

        target.dispatchEvent(
            new CustomEvent(actionEvent, {
                detail: { 
                    action: actionName,
                    enabled: this.actions[actionName].enabled,
                },
            })
        );
    }

    /**
     * @param {HTMLElement} target 
     */
    attachControllerListeners(target) {
        this.addControllerListener("mousedown", this.actionActivated, target);
        this.addControllerListener("mouseup", this.actionDeactivated, target);
    }

    detachControllerListeners() {
        this.removeControllerListener("mousedown");
        this.removeControllerListener("mouseup");
    }
}
