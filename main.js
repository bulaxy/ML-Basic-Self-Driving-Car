const N = 800

const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 200;

const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 300;


const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");
const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9)
// const car = new Car(road.getLaneCenter(1), 100, 30, 50, 'AI')
const cars = generateCars(N)
let bestCar = cars[0]

if (getLS("bestCar")) {
    bestCar.brain = getLS("bestCar")
    for (let i in cars) {
        cars[i].brain = getLS("bestCar")
        if (i != 0) {
            NeuralNetwork.mutate(cars[i].brain, 0.2)
        }
    }
}

const saveBestCar = () => {
    saveLS("bestCar", bestCar.brain)
}

const traffic = [
    new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(2), -300, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(0), -300, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(1), -500, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(1), -800, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(2), -1000, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(0), -1000, 30, 50, "DUMMY", 2),
]


function generateCars(N) {
    return Array(N + 1).fill().map(() => new Car(road.getLaneCenter(1), 100, 30, 50, 'AI'))
}

function reload() {
    window.location.reload()
}

const animate = (time) => {
    for (let i = 0; i < traffic.length; i++) {
        traffic[i].update(road.borders, []);
    }

    cars.forEach(car => car.update(road.borders, traffic))

    carCanvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight;

    bestCar = cars.find(c => c.y == Math.min(...cars.map(c => c.y)))

    carCtx.save();

    carCtx.translate(0, -bestCar.y + carCanvas.height * 0.75);

    road.draw(carCtx)

    carCtx.globalAlpha = 0.2
    cars.forEach((car, i) => car.draw(carCtx, 'blue'))
    carCtx.globalAlpha = 1
    bestCar.draw(carCtx, 'blue', true)

    for (let i = 0; i < traffic.length; i++) {
        traffic[i].draw(carCtx, "brown");
    }
    carCtx.restore();

    networkCtx.lineDashOffset = -time / 50;
    Visualizer.drawNetwork(networkCtx, bestCar.brain)
    requestAnimationFrame(animate)

}

animate();

