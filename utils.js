const lerp = (A, B, t) => A + (B - A) * t

const getIntersection = (line1Start, line1End, line2Start, line2End) => {

    /*
        Solve the intersection of 
        Ix = Ax + (Bx-Ax)t = Cx + (Dx-Cx)t 
        Iy = Ay + (By-Ay)t = Cy + (Dy-Cy)t 
        which get the equation below
    */

    const tTop = (line2End.x - line2Start.x) * (line1Start.y - line2Start.y) - (line2End.y - line2Start.y) * (line1Start.x - line2Start.x)
    const uTop = (line2Start.y - line1Start.y) * (line1Start.x - line1End.x) - (line2Start.x - line1Start.x) * (line1Start.y - line1End.y)
    const bottom = (line2End.y - line2Start.y) * (line1End.x - line1Start.x) - (line2End.x - line2Start.x) * (line1End.y - line1Start.y)

    // Make sure not dividing by 0
    if (bottom != 0) {
        const t = tTop / bottom
        const u = uTop / bottom

        // Make sure it is in between the line
        if (t >= 0 && t <= 1 && u >= 0 && u <= 1)
            return {
                x: lerp(line1Start.x, line1End.x, t),
                y: lerp(line1Start.y, line1End.y, t),
                offset: t
            }
    }

    return null
}

function polysIntersect(poly1, poly2) {
    for (let i in poly1) {
        for (let j in poly2) {
            const touch = getIntersection(
                poly1[i],
                poly1[(i + 1) % poly1.length], // Get first item when it is +1
                poly2[j],
                poly2[(j + 1) % poly2.length], // Get first item when it is +1
            );
            if (touch) return true;
        }
    }
    return false;
}

function getRGBA(value) {
    const alpha = Math.abs(value);
    const R = value < 0 ? 0 : 255;
    const G = R;
    const B = value > 0 ? 0 : 255;
    return "rgba(" + R + "," + G + "," + B + "," + alpha + ")";
}

function saveLS(itemName, item) {
    localStorage.setItem(itemName, JSON.stringify(item))
}

function getLS(itemName) {
    return JSON.parse(localStorage.getItem(itemName))
}

function discardLS(itemName) {
    localStorage.removeItem(itemName)
}