
require "./extend"

global.debug =
  raw_mouse: no
  wrapped_mouse: yes

width = 1200
height = 600

{g} = require "log-group"
g.set "clas", on

dom = require("./dom")

window.onload = ->

  dom.q("#paper").setAttribute "width", width
  dom.q("#paper").setAttribute "height", height
  dom.q("#cover").style.width = "#{width}px"
  dom.q("#cover").style.height = "#{height}px"

  drag = require("./drag").chan
  drag.emit "init"
  console.log "start"

  render = require("./render").chan
  # render.test()

  drag.on "update", (list) ->
    render.emit "render", list

  dom.q("#more").onclick = -> drag.emit "more"
  dom.q("#less").onclick = -> drag.emit "less"
  dom.q("#thicker").onclick = ->
    render.emit "thicker"
    drag.emit "trigger"
  dom.q("#thiner").onclick = ->
    render.emit "thiner"
    drag.emit "trigger"
  dom.q("#greater").onclick = ->
    render.emit "greater"
    drag.emit "trigger"
  dom.q("#smaller").onclick = ->
    render.emit "smaller"
    drag.emit "trigger"

  dom.q("#rotate").onclick = ->
    clas = dom.q("#paper").className
    g "clas", clas
    if clas.trim() is ""
      dom.q("#paper").className = "rotate"
    else
      dom.q("#paper").className = ""

  dom.q("#save").onclick = ->
    window.open dom.q("canvas").toDataURL()

  dom.q("#black").onclick = ->
    render.emit "color", "hsl(0,0%,0%)"
    drag.emit "trigger"
  dom.q("#red").onclick = ->
    render.emit "color", "hsl(0,80%,50%)"
    drag.emit "trigger"
  dom.q("#blue").onclick = ->
    render.emit "color", "hsl(240,80%,50%)"
    drag.emit "trigger"

  render.emit "color", "hsla(40,60%,60%,1)"
  drag.emit "trigger"