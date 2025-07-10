// @ts-check

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
     * @typedef {object} Action
     * @property {number[]} keys
     * @property {boolean} enabled
     * @property {boolean} active
     */ 
    /** @type {Object.<string, Object.<string, Action>>} */
    actions = {};

    /** @type {Object.<string, Object.<string, Set<number>>>} */ 
    actionKeys = {};

    /** 
     * @param {Object.<string, Object.<string, Action>>} actions
     * @param {Object.<string, Object.<string, Set<number>>>} actionKeys
     */
    initPlugin(actions, actionKeys) {
        this.actions = actions;
        this.actionKeys = actionKeys;
    }

    /**
     * @param {string} actionName 
     */
    enableAction(actionName) {
        this.actions[this.name][actionName].enabled = true;
    }

    /**
     * @param {string} actionName 
     */
    disableAction(actionName) {
        this.actions[this.name][actionName].enabled = false;
    }

    /**
     * @param {*} e 
     * @param {string} actionEvent 
     * @param {HTMLElement} target 
     */
    actionHandler = (e, actionEvent, target) => {
        const actionName = Object.keys(this.actions[this.name]).find(actionName => 
            this.actions[this.name][actionName].keys.includes(e[this.eventKey])
        );

        if (actionName === undefined || !this.actions[this.name][actionName].enabled) {
            return;
        }

        if (actionEvent === this.actionDeactivated) {
            this.actionKeys[this.name][actionName].delete(e[this.eventKey]);

            const allInactive = Object.keys(this.actionKeys).every(
                pluginName => this.actionKeys[pluginName][actionName].size === 0
            );

            if (allInactive) {
                Object.keys(this.actions).forEach(pluginName => {
                    this.actions[pluginName][actionName].active = false;
                });
            }
        }

        if (actionEvent === this.actionActivated) {
            this.actionKeys[this.name][actionName].add(e[this.eventKey]);
        }
        
        const isAlreadyActive = Object.keys(this.actions).some(
            pluginName => this.actions[pluginName][actionName].active
        );

        if (isAlreadyActive) return;
        
        if (actionEvent === this.actionActivated) {
            this.actions[this.name][actionName].active = true;
        }

        target.dispatchEvent(
            new CustomEvent(actionEvent, {
                detail: { 
                    action: actionName,
                    enabled: this.actions[this.name][actionName].enabled,
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
