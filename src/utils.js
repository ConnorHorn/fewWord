import { onDestroy } from 'svelte';

export function onInterval(callback, milliseconds) {
    const interval = setInterval(callback, milliseconds);

    onDestroy(() => {
        clearInterval(interval);
    });
}

export function isPointInsidePolygon(point, polygon) {
    // Same as before
}

export function doEdgesIntersect(p1, p2, q1, q2) {
    const det = (p2[0] - p1[0]) * (q2[1] - q1[1]) - (p2[1] - p1[1]) * (q2[0] - q1[0]);
    if (det === 0) return false; // Parallel lines

    const lambda = ((q2[1] - q1[1]) * (q2[0] - p1[0]) + (q1[0] - q2[0]) * (q2[1] - p1[1])) / det;
    const gamma = ((p1[1] - p2[1]) * (q2[0] - p1[0]) + (p2[0] - p1[0]) * (q2[1] - p1[1])) / det;

    return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
}

export function isPolygonInsidePolygon(polygon1, polygon2) {
    for (let point of polygon1) {
        if (!isPointInsidePolygon(point, polygon2)) {
            return false;
        }
    }

    for (let i = 0; i < polygon1.length; i++) {
        for (let j = 0; j < polygon2.length; j++) {
            const p1 = polygon1[i];
            const p2 = polygon1[(i + 1) % polygon1.length];
            const q1 = polygon2[j];
            const q2 = polygon2[(j + 1) % polygon2.length];

            if (doEdgesIntersect(p1, p2, q1, q2)) {
                return false;
            }
        }
    }

    return true;
}

