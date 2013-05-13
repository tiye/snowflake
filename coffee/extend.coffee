
Array::remove = (item) ->
  all = []
  all.push one unless one is item for one in @
  all

window.global = {}
{g} = require "log-group"

g.attrs =
  mouse: yes
