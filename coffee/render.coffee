
events = require "events"
{bend} = require "./bend"

chan = new events.EventEmitter

elem = require("./dom.coffee").find "#paper"
pen = elem.getContext "2d"

level = 8

draw = (list) ->
  pen.clearRect 0, 0, elem.offsetWidth, elem.offsetHeight
  pen.beginPath()
  if list[0]?
    {x, y} = list[0]
    pen.moveTo x, y
  
  list[1..].forEach (point) ->
    {x, y} = point
    pen.lineTo x, y
    # console.log x, y

  pen.stroke()

chan.on "color", (color) ->
  pen.strokeStyle = color

chan.on "level", (number) ->
  level = number

test = ->
  path = [
    {x: 100, y: 10}
    {x: 20, y: 40}
    {x: 40, y: 60}
  ]
  draw path

chan.on "render", (data) ->
  # data should be list of points [{x, y}]
  path = data.concat()
  template = data.concat()
  [1..level] ->
    path = bend path, template
  draw path

exports.chan = chan
exports.test = test