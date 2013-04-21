
elem = require("./dom.coffee").find "#paper"
pen = elem.getContext "2d"

vertexes = []

exports.draw = draw = (color, list) ->
  pen.clearRect 0, 0, elem.offsetWidth, elem.offsetHeight
  pen.beginPath()
  if list[0]?
    {x, y} = list[0]
    pen.moveTo x, y
  
  list[1..].forEach (point) ->
    {x, y} = point
    pen.lineTo x, y
    # console.log x, y

  pen.strokeStyle = color
  pen.stroke()

exports.test = ->
  draw "hsla(0,0%,80%, 0.7)", [ {x: 100, y: 10}, {x: 20, y: 40}, {x: 40, y: 60}]