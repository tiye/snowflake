
exports.find = (query) ->
  document.querySelector query

exports.drop = (name) ->
  div = document.createElement("div")
  div.setAttribute "class", "drag"
  div.innerText = name
  div

exports.new = (tag = "div") ->
  document.createElement tag