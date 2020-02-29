import {map, pipe, merge, fromEvent} from 'callbag-basics';
import dropRepeats from 'callbag-drop-repeats';
import { AbsoluteOrientationSensor } from 'motion-sensors-polyfill';

export function controllerSource() {
    return deviceOrientationSource();
}

function mouseSource() {
    return pipe(
        fromEvent(document, 'mousemove'),
        map(ev => ev.screenY),
        map(y => y / window.screen.height)
    )
}

function deviceOrientationSource() {
    return pipe(
        merge(modernOrientationSource(), deprecatedOrientationSource()),
        map(getOrientation),
        dropRepeats()
    )
}

function modernOrientationSource() {
    const orientation = new AbsoluteOrientationSensor({ frequency: 30 });
    orientation.start();
    return pipe(
        fromEvent(orientation, "reading"),
        map(ev => ev.target.quaternion),
        map(quaternion => quaternion[0]),
    );
}

function deprecatedOrientationSource() {
    return pipe(
        fromEvent(window, "deviceorientation"),
        map(ev => ev.beta), 
        map(beta => beta/90)
    );
}

function getOrientation(beta) {
    return beta;
}