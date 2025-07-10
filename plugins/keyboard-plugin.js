// @ts-check

import { ControllerPlugin } from "../controller-plugin.js";

export class KeyboardPlugin extends ControllerPlugin {
    name = "keys";
    eventKey = "keyCode";
    eventActivated = "keydown";
    eventDeactivated = "keyup";

    activeKeys = {};

    /**
     * @param {*} e 
     * @param {string} actionEvent 
     * @param {HTMLElement} target 
     */
    actionHandler(e, actionEvent, target) {
        if (actionEvent === this.actionActivated) this.activeKeys[e.keyCode] = true;
        if (actionEvent === this.actionDeactivated) this.activeKeys[e.keyCode] = false;
        super.actionHandler(e, actionEvent, target);
    }

    /**
     * @param {number} key 
     */
    isKeyPressed(key) {
        return this.activeKeys[key];
    }
}
