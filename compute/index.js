'use strict'

const synaptic = require('synaptic')

const Network = synaptic.Network
const Trainer = synaptic.Trainer
const Layer = synaptic.Layer

function Perceptron(input, hidden, output)
{
    // create the layers
    var inputLayer = new Layer(input)
    var hiddenLayer = new Layer(hidden)
    var outputLayer = new Layer(output)

    // connect the layers
    inputLayer.project(hiddenLayer)
    hiddenLayer.project(outputLayer)

    // set the layers
    this.set({
        input: inputLayer,
        hidden: [hiddenLayer],
        output: outputLayer
    })
}

// extend the prototype chain
Perceptron.prototype = new Network()
Perceptron.prototype.constructor = Perceptron

const expected = {
  layers: {
    hidden: 3
  },
  computables: [
	[0, 0],
	[1, 0],
	[0, 1],
	[1, 1]
  ],
  trainables: [
    {
      input: [0, 0],
      output: [0]
    },
    {
      input: [0, 1],
      output: [0]
    },
    {
      input: [1, 0],
      output: [0]
    },
    {
      input: [1, 1],
      output: [1]
    }
  ],
  iterations: 1000,
  precision: 0.0001
}

const defaults = {
  layers: { hidden: 1 },
  computables: [[]],
  trainables: [{ inputs: [], outputs: [] }],
  iterations: 1000,
  precision: 0.001
}

function run (body) {
  const model = Object.assign({}, defaults, body)
  console.log(JSON.stringify(model, null, 2))
  const config = {
    iterations: model.iterations || defaults.iterations,
    error: model.precision || defaults.precision
  }

  const inputs = model.trainables[0].input.length
  const outputs = model.trainables[0].output.length
  const hidden = model.layers.hidden

  console.log('inputs:', inputs, 'hidden:', hidden, 'outputs:', outputs)

  const perceptron = new Perceptron(inputs, hidden, outputs)
  const trainer = new Trainer(perceptron)

  const trainment = trainer.train(model.trainables, config) // { error: 0.004998819355993572, iterations: 21871, time: 356 }
  const results = model.computables.map(test => perceptron.activate(test))

  console.log('trainment:', trainment)
  console.log('results:', results)

  return { trainment: trainment, results: results }
}

module.exports.handler = (event, context, callback) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify(run(JSON.parse(event.body))),
  }

  callback(null, response)
}

