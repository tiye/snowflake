
exports.find = (query) ->
  document.querySelector query

exports.drop = (name) ->
  div = document.createElement("div")
  div.setAttribute "class", "drop"
  div.setAttribute "draggable", "true"
  div.innerText = name
  div