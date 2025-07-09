import { ControllerPlugin, KeyboardPlugin } from "./controller-plugin.js";
import { ACTION_ACTIVATED, ACTION_DEACTIVATED } from "./constants.js";

export class InputController {
    enabled = true;
    focused = true;

    // #actions = {};
    #keys = {}; 
    // #keyboardListeners = {};
    // #actionKeys = {};

    /** @type {Object.<string, ControllerPlugin>} */
    #plugins = {
        "keyboard": new KeyboardPlugin(), // default
    };

    constructor(actionsToBind = {}, target = null) {
        this.bindActions(actionsToBind);

        if (target) {
            this.attach(target);
        }
    }

    /** 
     * @param {ControllerPlugin[]} plugins 
     */
    addPlugins(plugins) {
        plugins.forEach(plugin => {
            this.#plugins[plugin.name] = plugin;
        });

        console.log(this.#plugins);
    }

    bindActions(actionsToBind) {
        Object.keys(actionsToBind).forEach(actionName => {
            // this.#actions[actionName] = {
            //     keys: actionsToBind[actionName].keys,
            //     enabled: actionsToBind[actionName].enabled ?? true,
            //     active: false,
            // };

            // this.#actionKeys[actionName] = new Set();

            Object.keys(this.#plugins).forEach(pluginName => {
                const keys = actionsToBind[actionName][this.#plugins[pluginName].keysPropertyName];
                this.#plugins[pluginName].initAction(
                    actionName,
                    keys,
                    actionsToBind[actionName].enabled ?? true,
                    false,
                );
            });
        });
    }

    enableAction(actionName) {
        // this.#actions[actionName].enabled = true;
        Object.keys(this.#plugins).forEach(pluginName => {
            this.#plugins[pluginName].enableAction(actionName);
        });
    }

    disableAction(actionName) {
        // this.#actions[actionName].enabled = false;
        Object.keys(this.#plugins).forEach(pluginName => {
            this.#plugins[pluginName].disableAction(actionName);
        });
    }

    // #keyboardHandler = (event, actionEvent, target) => {
    //     this.#keys[event.keyCode] = actionEvent === ACTION_ACTIVATED;

    //     const action = Object.keys(this.#actions).find(action => 
    //         this.#actions[action].keys.includes(event.keyCode)
    //     );

    //     if (!this.enabled || 
    //         this.#actions[action] === undefined ||
    //         !this.#actions[action].enabled) {
    //         return;
    //     }

    //     if (actionEvent === ACTION_DEACTIVATED) {
    //         this.#actionKeys[action].delete(event.keyCode);
    //         if (this.#actionKeys[action].size === 0) {
    //             this.#actions[action].active = false;
    //         }
    //     }

    //     if (actionEvent === ACTION_ACTIVATED) {
    //         this.#actionKeys[action].add(event.keyCode);
    //     }

    //     if (this.#actions[action].active) return;
        
    //     if (actionEvent === ACTION_ACTIVATED) {
    //         this.#actions[action].active = true;
    //     }

    //     target.dispatchEvent(
    //         new CustomEvent(actionEvent, {
    //             detail: { 
    //                 action,
    //                 enabled: this.#actions[action].enabled,
    //             },
    //         })
    //     );
    // };

    // #addKeyboardListener = (event, actionEvent, target) => {
    //     if (this.#keyboardListeners[event]) return;

    //     const listener = (e) => {
    //         this.#keyboardHandler(e, actionEvent, target);
    //     };

    //     this.#keyboardListeners[event] = listener;
    //     document.addEventListener(event, listener);
    // };

    // #removeKeyboardListener = (event) => {
    //     if (this.#keyboardListeners[event]) {
    //         document.removeEventListener(event, this.#keyboardListeners[event]);
    //         delete this.#keyboardListeners[event];
    //     }
    // };

    #windowFocusHandler = () => {
        this.focused = true; 
    };

    #windowUnfocusHandler = () => {
        this.focused = false;
    };

    attach(target, dontEnable = false) {
        this.enabled = !dontEnable;

        // this.#addKeyboardListener("keydown", ACTION_ACTIVATED, target);
        // this.#addKeyboardListener("keyup", ACTION_DEACTIVATED, target);
        Object.keys(this.#plugins).forEach(pluginName => {
            this.#plugins[pluginName].attachControllerListeners(target);
        });

        window.addEventListener("focus", this.#windowFocusHandler);
        window.addEventListener("blur", this.#windowUnfocusHandler);
    }

    detach() {
        this.enabled = false;

        // this.#removeKeyboardListener("keydown");
        // this.#removeKeyboardListener("keyup");
        Object.keys(this.#plugins).forEach(pluginName => {
            this.#plugins[pluginName].detachControllerListeners();
        });

        window.removeEventListener("focus", this.#windowFocusHandler);
        window.removeEventListener("blur", this.#windowUnfocusHandler);
    }

    isActionActive(actionName) {
        // if (this.#actions[action] !== undefined) {
        //     return this.#actions[action].active;
        // }
        const action = this.#plugins["keyboard"].actions[actionName];
        if (action !== undefined) {
            return action.active;
        }
    }

    isKeyPressed(keyCode) {
        return this.#keys[keyCode];
    }

    getActions() {
        return this.#plugins["keyboard"].actions;
    }
}
