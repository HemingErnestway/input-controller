// @ts-check

import { ControllerPlugin } from "../controller-plugin.js";

export class MousePlugin extends ControllerPlugin {
    name = "mouseButtons";
    eventKeyName = "button";
    eventActivatedName = "mousedown";
    eventDeactivatedName = "mouseup";
}
