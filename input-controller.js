export class InputController {
    enabled = true;
    focused = true;
    ACTION_ACTIVATED = "input-controller:action-activated";
    ACTION_DEACTIVATED = "input-controller:action-deactivated";

    #actions = {};
    #keys = {};
    #keyboardListeners = {};

    constructor(actionsToBind = {}, target = null) {
        this.bindActions(actionsToBind);

        if (target) {
            this.attach(target);
        }
    }

    bindActions(actionsToBind) {
        Object.keys(actionsToBind).forEach((actionName) => {
            this.#actions[actionName] = {
                keys: actionsToBind[actionName].keys,
                enabled: actionsToBind[actionName].enabled ?? true,
                active: new Set(),
            };
        });
    }

    enableAction(actionName) {
        this.#actions[actionName].enabled = true;
    }

    disableAction(actionName) {
        this.#actions[actionName].enabled = false;
    }

    #keyboardHandler = (event, actionEvent, target) => {
        this.#keys[event.keyCode] = actionEvent === this.ACTION_ACTIVATED;

        const action = Object.keys(this.#actions).find(action => 
            this.#actions[action].keys.includes(event.keyCode)
        );

        if (!this.enabled || 
            this.#actions[action] === undefined ||
            !this.#actions[action].enabled) {
            return;
        }

        if (actionEvent === this.ACTION_DEACTIVATED) {
            this.#actions[action].active.delete(event.keyCode);
        }

        if (this.#actions[action].active.has(event.keyCode)) return;

        if (actionEvent === this.ACTION_ACTIVATED) {
            this.#actions[action].active.add(event.keyCode);
        }

        target.dispatchEvent(
            new CustomEvent(actionEvent, {
                detail: { 
                    action,
                    enabled: this.#actions[action].enabled,
                    keyCode: event.keyCode,
                },
            })
        );
    };

    #addKeyboardListener = (event, actionEvent, target) => {
        if (this.#keyboardListeners[event]) return;

        const listener = (e) => {
            this.#keyboardHandler(e, actionEvent, target);
        };

        this.#keyboardListeners[event] = listener;
        document.addEventListener(event, listener);
    };

    #removeKeyboardListener = (event) => {
        if (this.#keyboardListeners[event]) {
            document.removeEventListener(event, this.#keyboardListeners[event]);
            delete this.#keyboardListeners[event];
        }
    };

    attach(target, dontEnable = false) {
        this.enabled = !dontEnable;
        this.#addKeyboardListener("keydown", this.ACTION_ACTIVATED, target);
        this.#addKeyboardListener("keyup", this.ACTION_DEACTIVATED, target);
    }

    detach() {
        this.enabled = false;
        this.#removeKeyboardListener("keydown");
        this.#removeKeyboardListener("keyup");
    }

    isActionActive(action) {
        if (this.#actions[action] !== undefined) {
            return this.#actions[action].active.size > 0;
        }
    }

    isKeyPressed(keyCode) {
        return this.#keys[keyCode];
    }

    getActions() {
        return this.#actions;
    }
}
