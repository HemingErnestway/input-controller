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

    #keyboardHandler = (event, actionEvent, target) => {
        const action = Object.keys(this.#actions).find(action => 
            this.#actions[action].keys.includes(event.keyCode)
        );

        if (!this.enabled || 
            this.#actions[action] === undefined ||
            !this.#actions[action].enabled) {
            return;
        }

        target.dispatchEvent(
            new CustomEvent(actionEvent, {
                detail: { 
                    action,
                    enabled: this.#actions[action].enabled,
                },
            })
        );
    };

    #addKeyboardListener = (event, actionEvent, target) => {
        if (document._keyboardListeners && document._keyboardListeners[event]) {
            return;
        }

        const listener = (e) => {
            this.#keyboardHandler(e, actionEvent, target);
        };

        document._keyboardListeners = document._keyboardListeners || {};
        document._keyboardListeners[event] = listener;

        document.addEventListener(event, listener);
    };

    #removeKeyboardListener = (event) => {
        if (document._keyboardListeners && document._keyboardListeners[event]) {
            document.removeEventListener(
                event, 
                document._keyboardListeners[event],
            );
            delete document._keyboardListeners[event];
        }
    };

    attach(target, dontEnable = false) {
        this.#addKeyboardListener("keydown", this.ACTION_ACTIVATED, target);
        this.#addKeyboardListener("keyup", this.ACTION_DEACTIVATED, target);
    }

    detach() {
        this.#removeKeyboardListener("keydown");
        this.#removeKeyboardListener("keyup");
    }

    isActionActive(action) {
    }

    isKeyPressed(keyCode) {
    }

    getActions() {
        return this.#actions;
    }
}
