class Sensor {
    constructor(car) {
        this.car = car;
        this.rayCount = 3;
        this.rayLength = 100
        this.raySpread = Math.PI / 4;

        this.rays = []
        this.readings = []
    }

    update(roadBorders, traffic) {
        this.#castRays()
        this.readings = this.rays.map(ray => this.#getReading(ray, roadBorders, traffic))
    }

    #getReading(ray, boarders, traffic) {
        let touches = [];
        let touch
        for (let boarder of boarders) {
            touch = getIntersection(ray[0], ray[1], boarder[0], boarder[1])
            if (touch) touches.push(touch)
        }

        for (let trafficCar of traffic) {
            let poly = trafficCar.polygon
            for (let i in poly) {
                touch = getIntersection(ray[0], ray[1], poly[i], poly[(i + 1) % poly.length])
                if (touch) touches.push(touch)
            }
        }

        if (!touches.length) return null
        return touches.sort((a, b) => a.offset - b.offset)[0]
    }

    #castRays() {
        this.rays = []
        // Casting Rays based on spread, count and length
        for (let i = 0; i < this.rayCount; i++) {
            const rayAngle = lerp(this.raySpread / 2, -this.raySpread / 2, i / (this.rayCount - 1 || 1)) + this.car.angle

            const start = { x: this.car.x, y: this.car.y }
            const end = {
                x: this.car.x - Math.sin(rayAngle) * this.rayLength,
                y: this.car.y - Math.cos(rayAngle) * this.rayLength,
            }

            this.rays.push([start, end])
        }
    }


    draw(ctx) {
        this.rays.forEach((ray, i) => {
            let end = ray[1]
            if (this.readings[i]) end = this.readings[i]

            // Sensor Line
            ctx.beginPath()
            ctx.lineWidth = 2
            ctx.strokeStyle = "yellow"

            ctx.moveTo(ray[0].x, ray[0].y)
            ctx.lineTo(end.x, end.y)
            ctx.stroke()

            // Sensed Area
            ctx.beginPath()
            ctx.lineWidth = 2
            ctx.strokeStyle = "red"

            ctx.moveTo(ray[1].x, ray[1].y);
            ctx.lineTo(end.x, end.y);
            ctx.stroke()
        })

    }
}