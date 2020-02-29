import {map, pipe, fromEvent} from 'callbag-basics';
import dropRepeats from 'callbag-drop-repeats';

export function controllerSource() {
    return mouseSource();
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