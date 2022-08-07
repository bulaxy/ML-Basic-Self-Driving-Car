class NeuralNetwork {

    constructor(neuronCnts) {
        this.levels = []

        for (let i = 0; i < neuronCnts.length - 1; i++) {
            this.levels.push(new Level(neuronCnts[i], neuronCnts[i + 1]))
        }
    }

    static feedForward(givenInputs, network) {
        let outputs = Level.feedForward(givenInputs, network.levels[0])

        for (let i in network.levels) {
            if (i === 0) {
                outputs = Level.feedForward(givenInputs, network.levels[0])
                continue
            }
            outputs = Level.feedForward(outputs, network.levels[i])
        }
        return outputs
    }

    static mutate(network, amount = 1) {
        network.levels.forEach(level => {
            for (let i in level.biases) {
                level.biases[i] = lerp(level.biases[i], Math.random() * 2 - 1, amount)
            }

            for (let i in level.weights) {
                for (let j in level.weights[i]) {
                    level.weights[i][j] = lerp(level.weights[i][j], Math.random() * 2 - 1, amount)
                }
            }
        });
    }
}

class Level {
    constructor(inputCnt, outputCnt) {
        this.inputs = new Array(inputCnt).fill();
        this.outputs = new Array(outputCnt).fill();
        this.biases = new Array(outputCnt).fill()

        this.weights = Array(inputCnt).fill().map(() => new Array(outputCnt).fill())

        Level.#randomize(this);

    }

    static #randomize(level) {
        for (let i in level.inputs) {
            for (let j in level.outputs) {
                level.weights[i][j] = Math.random() * 2 - 1;
            }
        }

        for (let i in level.biases) {
            level.biases[i] = Math.random() * 2 - 1;
        }
    }

    static feedForward(givenInputs, level) {

        for (let i in level.inputs) {
            level.inputs[i] = givenInputs[i];
        }

        for (let i in level.outputs) {
            let sum = 0
            for (let j in level.inputs) {
                sum += level.inputs[j] * level.weights[j][i];
            }

            level.outputs[i] = sum > level.biases[i] ? 1 : 0
        }

        return level.outputs;
    }
}