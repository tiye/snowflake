
count =
  data: 0
  new: -> @data += 1

random = (n = 600) -> Math.random() * n

dom = require("./dom.coffee")
area = dom.find("#cover")

create = (map, events) ->
  id = count.new()
  drop = dom.drop id
  area.appendChild drop
  map[id] =
    elem: drop
    x: random()
    y: random()

  drop.style.top = "#{map[id].y}px"
  drop.style.left = "#{map[id].x}px"

  drop.ondragstart = (drag) ->

  drop.ondragend = (drag) ->
    drop.style.top = "#{drag.offsetY + drop.offsetTop}px"
    drop.style.left = "#{drag.offsetX + drop.offsetLeft}px"
    console.log map

  drop.ondrag = (drag) ->
    x = drag.offsetX + drop.offsetLeft
    y = drag.offsetY + drop.offsetTop
    map[id].x = x
    map[id].y = y
    events.trigger "update", map

exports.init = init = (registry, events) ->
  create registry, events
  create registry, events
  create registry, events
  create registry, events

  window.expose = {}
  exports.add = expose.add = ->
    create registry, events
    events.trigger "update", registry

  exports.remove = expose.remove = ->
    keys = Object.keys registry
    last_one = keys[keys.length - 1]
    console
    elem = registry[last_one].elem
    elem.parentElement.removeChild elem
    delete registry[last_one] if last_one?
    events.trigger "update", registry
