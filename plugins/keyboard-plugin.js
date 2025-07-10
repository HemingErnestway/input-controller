// @ts-check

import { ControllerPlugin } from "../controller-plugin.js";

export class KeyboardPlugin extends ControllerPlugin {
    name = "keys";
    eventKeyName = "keyCode";
    eventActivatedName = "keydown";
    eventDeactivatedName = "keyup";
}
