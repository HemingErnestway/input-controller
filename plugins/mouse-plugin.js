// @ts-check

import { ControllerPlugin } from "../controller-plugin.js";

export class MousePlugin extends ControllerPlugin {
    name = "mouseButtons";
    eventKey = "button";
    eventActivated = "mousedown";
    eventDeactivated = "mouseup";
}
