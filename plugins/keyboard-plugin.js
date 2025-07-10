// @ts-check

import { ControllerPlugin } from "../controller-plugin.js";

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
