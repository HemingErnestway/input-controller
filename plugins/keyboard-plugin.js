// @ts-check

import { ControllerPlugin } from "../controller-plugin.js";

export class KeyboardPlugin extends ControllerPlugin {
    name = "keys";
    eventKey = "keyCode";
    eventActivated = "keydown";
    eventDeactivated = "keyup";
}
