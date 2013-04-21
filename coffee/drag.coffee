
events = require "events"
poke = new events.EventEmitter

count =
  data: 0
  new: -> @data += 1

random = (n = 600) -> Math.random() * n

dom = require("./dom.coffee")
area = dom.find("#cover")

registry = {}

drag_update = (drag, drop) ->
  x = drag.offsetX + drop.offsetLeft
  y = drag.offsetY + drop.offsetTop
  drop.style.left = "#{x}px"
  drop.style.top = "#{y}px"
  registry[id].x = x
  registry[id].y = y
  poke.emit "update", registry

create = ->
  id = count.new()
  drop = dom.drop id
  area.appendChild drop
  registry[id] =
    elem: drop
    x: random()
    y: random()

  drop.style.top = "#{registry[id].y}px"
  drop.style.left = "#{registry[id].x}px"

  drop.ondrag = (drag) ->
    drag_update drag, drop

poke.on "init", ->
  create() for _ in [1..4]

poke.on "more", ->
  create()
  poke.emit "update"

poke.on "less", ->
  keys = Object.keys registry
  last_one = keys[keys.length - 1]
  elem = registry[last_one].elem
  elem.parentElement.removeChild elem
  delete registry[last_one] if last_one?
  events.trigger "update", registry
  poke.emit "update"

exports.poke = poke
