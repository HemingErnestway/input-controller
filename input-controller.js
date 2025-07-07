export class InputController {
    enabled = true;
    focused = true;
    ACTION_ACTIVATED = "input-controller:action-activated";
    ACTION_DEACTIVATED = "input-controller:action-deactivated";

    #actions = {};

    constructor(actionsToBind = {}, target = null) {
    }

    bindActions(actionsToBind) {
        Object.keys(actionsToBind).forEach((actionName) => {
            this.#actions[actionName] = {
                keys: actionsToBind[actionName].keys,
                enabled: actionsToBind[actionName].enabled ?? true,
            };
        });
    }

    enableAction(actionName) {
        this.#actions[actionName].enabled = true;
    }

    disableAction(actionName) {
        this.#actions[actionName].enabled = false;
    }

    attach(target, dontEnable = false) {
        document.addEventListener("keydown", (e) => {
            const action = Object
                .keys(this.#actions)
                .find(action => this.#actions[action].keys.includes(e.keyCode));

            if (this.#actions[action] === undefined || !this.#actions[action].enabled) {
                return;
            }

            target.dispatchEvent(
                new CustomEvent(this.ACTION_ACTIVATED, {
                    detail: { 
                        action,
                        enabled: this.#actions[action].enabled,
                    },
                })
            );
        });

        document.addEventListener("keyup", (e) => {
            const action = Object
                .keys(this.#actions)
                .find(action => this.#actions[action].keys.includes(e.keyCode));

            if (this.#actions[action] === undefined || !this.#actions[action].enabled) {
                return;
            }

            target.dispatchEvent(
                new CustomEvent(this.ACTION_DEACTIVATED, {
                    detail: { 
                        action,
                        enabled: this.#actions[action].enabled,
                    },
                })
            );
        });
    }

    detach() {
    }

    isActionActive(action) {
    }

    isKeyPressed(keyCode) {
    }

    getActions() {
        return this.#actions;
    }
}
