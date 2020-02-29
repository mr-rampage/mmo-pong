import {map, pipe, fromEvent} from 'callbag-basics';
import dropRepeats from 'callbag-drop-repeats';

export function controllerSource() {
    if (window.DeviceOrientationEvent) {
        return deviceOrientationSource()
    } else {
        return mouseSource();
    }
}

function mouseSource() {
    return pipe(
        fromEvent(document, 'mousemove'),
        map(ev => ev.screenY),
        map(y => y / window.screen.height),
        map(getDirection),
        dropRepeats()
    )
}


function getDirection(unitY) {
    if (unitY > 0.4 && unitY < 0.6) {
        return 0;
    } else if (unitY <= 0.4) {
        return 1;
    } else {
        return -1;
    }
}

function deviceOrientationSource() {
    return pipe(
        fromEvent(window, "deviceorientation"),
        map(ev => ev.beta),
        map(getOrientation),
        dropRepeats()
    )
}

function getOrientation(beta) {
    if (beta > -10 && beta < 10) {
        return 0;
    } else if (beta <= 10) {
        return 1;
    } else {
        return -1;
    }
}