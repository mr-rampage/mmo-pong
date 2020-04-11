import map from 'callbag-map';
import pipe from 'callbag-pipe';
import merge from 'callbag-merge';
import fromEvent from 'callbag-from-event';
import dropRepeats from 'callbag-drop-repeats';
import { AbsoluteOrientationSensor } from 'motion-sensors-polyfill';

export function controllerSource() {
    return pipe(
        merge(modernOrientationSource(), deprecatedOrientationSource(), mouseLocationSource()),
        dropRepeats()
    )
}

function mouseLocationSource() {
    return pipe(
        fromEvent(document, 'mousemove'),
        map(ev => ev.screenY),
        map(y => y / window.screen.height)
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