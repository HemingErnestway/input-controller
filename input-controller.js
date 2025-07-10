// @ts-check

import { ControllerPlugin } from "./controller-plugin.js";
import { KeyboardPlugin } from "./plugins/keyboard-plugin.js";

export class InputController {
    enabled = true;
    focused = true;
    ACTION_ACTIVATED = "input-controller:action-activated";
    ACTION_DEACTIVATED = "input-controller:action-deactivated";

    #keys = {}; 
    #actionsToBind = {};

    /** @type {Object.<string, ControllerPlugin>} */
    #plugins = {
        "keyboard": new KeyboardPlugin(), // default
    };

    constructor(actionsToBind = {}, target = null) {
        this.#actionsToBind = actionsToBind;
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
        this.bindActions(this.#actionsToBind);
    }

    bindActions(actionsToBind) {
        Object.keys(actionsToBind).forEach(actionName => {
            Object.keys(this.#plugins).forEach(pluginName => {
                const keys = actionsToBind[actionName][this.#plugins[pluginName].keysPropertyName];
                this.#plugins[pluginName].initAction(
                    actionName,
                    keys,
                    actionsToBind[actionName].enabled ?? true,
                    false,
                    this.ACTION_ACTIVATED,
                    this.ACTION_DEACTIVATED,
                );
            });
        });
    }

    enableAction(actionName) {
        Object.keys(this.#plugins).forEach(pluginName => {
            this.#plugins[pluginName].enableAction(actionName);
        });
    }

    disableAction(actionName) {
        Object.keys(this.#plugins).forEach(pluginName => {
            this.#plugins[pluginName].disableAction(actionName);
        });
    }

    #windowFocusHandler = () => {
        this.focused = true; 
    };

    #windowUnfocusHandler = () => {
        this.focused = false;
    };

    attach(target, dontEnable = false) {
        this.enabled = !dontEnable;

        Object.keys(this.#plugins).forEach(pluginName => {
            this.#plugins[pluginName].attachControllerListeners(target);
        });

        window.addEventListener("focus", this.#windowFocusHandler);
        window.addEventListener("blur", this.#windowUnfocusHandler);
    }

    detach() {
        this.enabled = false;

        Object.keys(this.#plugins).forEach(pluginName => {
            this.#plugins[pluginName].detachControllerListeners();
        });

        window.removeEventListener("focus", this.#windowFocusHandler);
        window.removeEventListener("blur", this.#windowUnfocusHandler);
    }

    isActionActive(actionName) {
        return Object.keys(this.#plugins).some(pluginName => 
            this.#plugins[pluginName].actions[actionName]?.active
        );
    }

    isKeyPressed(keyCode) {
        return this.#keys[keyCode];
    }

    getActions() {
        return this.#plugins["keyboard"].actions;
    }
}
