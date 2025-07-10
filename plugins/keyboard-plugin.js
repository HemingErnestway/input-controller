// @ts-check

import { ControllerPlugin } from "../controller-plugin.js";

export class KeyboardPlugin extends ControllerPlugin {
    name = "keyboard";
    keysPropertyName = "keys";
    eventKeyName = "keyCode";
    eventActivatedName = "keydown";
    eventDeactivatedName = "keyup";
}
