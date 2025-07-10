// @ts-check

/** 
 * @typedef {object} Action
 * @property {number[]} keys
 * @property {boolean} enabled
 * @property {boolean} active
 */ 
/** @type {Object.<string, Object.<string, Action>>} */
export const actions = {};

/** @type {Object.<string, Object.<string, Set<number>>>} */ 
const actionKeys = {};

export class ControllerPlugin {
    /** @type {string} */ name;
    /** @type {string} */ eventKey;
    /** @type {string} */ eventActivated;
    /** @type {string} */ eventDeactivated;

    /** @type {string} */ actionActivated;
    /** @type {string} */ actionDeactivated;

    /** @type {Object.<string, EventListener>} */ 
    controllerListeners = {};

    /** 
     * @param {string} actionName 
     * @param {number[]} keys 
     * @param {boolean} enabled 
     * @param {boolean} active 
     * @param {string} actionActivated 
     * @param {string} actionDeactivated 
     */
    initAction(actionName, keys, enabled, active, actionActivated, actionDeactivated) {
        if (actions[this.name] === undefined) {
            actions[this.name] = {};
        }
        actions[this.name][actionName] = { keys, enabled, active };

        if (actionKeys[this.name] === undefined) {
            actionKeys[this.name] = {};
        }
        actionKeys[this.name][actionName] = new Set();

        this.actionActivated = actionActivated;
        this.actionDeactivated = actionDeactivated;
    }

    /**
     * @param {string} actionName 
     */
    enableAction(actionName) {
        actions[this.name][actionName].enabled = true;
    }

    /**
     * @param {string} actionName 
     */
    disableAction(actionName) {
        actions[this.name][actionName].enabled = false;
    }

    /**
     * @param {*} e 
     * @param {string} actionEvent 
     * @param {HTMLElement} target 
     */
    actionHandler = (e, actionEvent, target) => {
        const actionName = Object.keys(actions[this.name]).find(actionName => 
            actions[this.name][actionName].keys.includes(e[this.eventKey])
        );

        if (actionName === undefined || !actions[this.name][actionName].enabled) {
            return;
        }

        if (actionEvent === this.actionDeactivated) {
            actionKeys[this.name][actionName].delete(e[this.eventKey]);

            const allInactive = Object.keys(actionKeys).every(
                pluginName => actionKeys[pluginName][actionName].size === 0
            );

            if (allInactive) {
                Object.keys(actions).forEach(pluginName => {
                    actions[pluginName][actionName].active = false;
                });
            }
        }

        if (actionEvent === this.actionActivated) {
            actionKeys[this.name][actionName].add(e[this.eventKey]);
        }
        
        const isAlreadyActive = Object.keys(actions).some(
            pluginName => actions[pluginName][actionName].active
        );

        if (isAlreadyActive) return;
        
        if (actionEvent === this.actionActivated) {
            actions[this.name][actionName].active = true;
        }

        target.dispatchEvent(
            new CustomEvent(actionEvent, {
                detail: { 
                    action: actionName,
                    enabled: actions[this.name][actionName].enabled,
                },
            })
        );
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
        this.addControllerListener(this.eventActivated,this.actionActivated, target);
        this.addControllerListener(this.eventDeactivated, this.actionDeactivated, target);
    }

    detachControllerListeners() {
        this.removeControllerListener(this.eventActivated);
        this.removeControllerListener(this.eventDeactivated);
    }
}
