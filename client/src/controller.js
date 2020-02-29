import {map, pipe, fromEvent} from 'callbag-basics';
import dropRepeats from 'callbag-drop-repeats';
import { AbsoluteOrientationSensor } from 'motion-sensors-polyfill';

export function controllerSource() {
    return deviceOrientationSource()
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
    const orientation = new AbsoluteOrientationSensor({ frequency: 30 });
    orientation.start();
    return pipe(
        fromEvent(orientation, "reading"),
        map(ev => ev.target.quaternion),
        map(quaternion => quaternion[0]),
        map(getOrientation),
        dropRepeats()
    )
}

function getOrientation(beta) {
    if (beta > -0.1 && beta < 0.1) {
        return 0;
    } else if (beta <= 0.1) {
        return 1;
    } else {
        return -1;
    }
}