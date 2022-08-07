class Car {
    constructor(x, y, width, height, controlType, maxSpeed = 3) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.speed = 0;
        this.acceleration = 0.2;
        this.maxSpeed = maxSpeed;
        this.friction = 0.05;
        this.angle = 0;

        this.useBrain = controlType === "AI"

        if (controlType != "DUMMY") {
            this.sensor = new Sensor(this)
            this.brain = new NeuralNetwork(
                [this.sensor.rayCount, 6, 4]
            )
        }

        this.controls = new Controls(controlType);

        this.damaged = false
    }

    #move() {
        if (this.controls.forward) {
            this.speed += this.acceleration
            // this.y -= 2;
        }

        if (this.controls.reverse) {
            this.speed -= this.acceleration
            // this.y += 2;
        }

        if (this.speed > this.maxSpeed) this.speed = this.maxSpeed
        if (this.speed < -this.maxSpeed) this.speed = -this.maxSpeed / 2

        if (this.speed > 0) this.speed -= this.friction
        if (this.speed < 0) this.speed += this.friction

        if (this.speed != 0) {
            const flip = this.speed > 0 ? 1 : -1;
            if (this.controls.left) {
                this.angle += 0.03 * flip;
            }
            if (this.controls.right) {
                this.angle -= 0.03 * flip;
            }
        }

        this.x -= Math.sin(this.angle) * this.speed;
        this.y -= Math.cos(this.angle) * this.speed;
    }

    #createPolygon() {
        const rad = Math.hypot(this.width, this.height) / 2
        const angle = Math.atan2(this.width, this.height)

        return [
            {
                x: this.x - Math.sin(this.angle - angle) * rad,
                y: this.y - Math.cos(this.angle - angle) * rad,
            },
            {
                x: this.x - Math.sin(this.angle + angle) * rad,
                y: this.y - Math.cos(this.angle + angle) * rad,
            },
            {
                x: this.x - Math.sin(Math.PI + this.angle - angle) * rad,
                y: this.y - Math.cos(Math.PI + this.angle - angle) * rad,
            },
            {
                x: this.x - Math.sin(Math.PI + this.angle + angle) * rad,
                y: this.y - Math.cos(Math.PI + this.angle + angle) * rad
            },
        ]
    }

    update(roadBorders, traffic) {
        if (!this.damaged) {
            this.#move()
            this.polygon = this.#createPolygon()
            this.damaged = this.#assessDamage(roadBorders, traffic);
        }
        if (this.sensor) {

            this.sensor.update(roadBorders, traffic);
            const offsets = this.sensor.readings.map(s => s == null ? 0 : 1 - s.offset)
            const outputs = NeuralNetwork.feedForward(offsets, this.brain)

            if (this.useBrain) {
                this.controls.forward = outputs[0]
                this.controls.left = outputs[1]
                this.controls.right = outputs[2]
                this.controls.reverse = outputs[3]
            }
        }
    }

    #assessDamage(roadBorders, traffic) {
        for (let roadBorder of roadBorders) {
            if (polysIntersect(this.polygon, roadBorder)) return true;
        }
        for (let trafficCar of traffic) {
            if (polysIntersect(this.polygon, trafficCar.polygon)) return true;
        }
        return false;
    }

    draw(ctx, color, drawSensor) {
        // ctx.save();
        // ctx.translate(this.x, this.y);
        // ctx.rotate(-this.angle)
        // ctx.beginPath()
        // ctx.rect(
        //     - this.width / 2,
        //     - this.height / 2,
        //     this.width,
        //     this.height
        // );
        // ctx.fill()
        // ctx.restore()

        if (this.damaged) {
            ctx.fillStyle = "gray";
        } else {
            ctx.fillStyle = color
        }
        ctx.beginPath()
        ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
        for (let i in this.polygon) {
            ctx.lineTo(this.polygon[i].x, this.polygon[i].y)
        }
        ctx.fill()
        if (drawSensor) this.sensor?.draw(ctx)
    }
}

