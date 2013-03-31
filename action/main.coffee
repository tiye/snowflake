
renderer = require "./renderer.coffee"
bender = require "./bender.coffee"

draw = renderer.draw
bend = bender.bend

test = ->
  renderer.test()
  bender.test()

path = [
  {x: 100,  y: 100}
  {x: 360,  y: 140}
  {x: 460,  y: 240}
  {x: 400,  y: 400}
  {x: 500,  y: 300}
]

test_curve = ->
  course = path
  [1..4].forEach ->
    course = bend course, path
  draw "hsl(240,90%,80%)", course
  console.log course.length

events = require "./events.coffee"
global_map = {}

# test()
# test_curve()
# events.test()

events.on "update", (data) ->
  result = []
  for key, value of data
    result.push value
  course = result.concat()
  [1..4].forEach ->
    course = bend course, result
  draw  "hsl(240,80%,40%)", course

drop = require "./drop.coffee"
drop.init global_map, events