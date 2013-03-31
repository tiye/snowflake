
renderer = require "./renderer.coffee"
bender = require "./bender.coffee"

draw = renderer.draw
bend = bender.bend

test = ->
  renderer.test()
  bender.test()

path = [
  {x: 100, y: 100}
  {x: 200, y: 400}
  {x: 300, y: 600}
]

test_curve = ->
  course = bend path, path
  console.log course
  draw "hsl(240,90%,80%)", course

test()