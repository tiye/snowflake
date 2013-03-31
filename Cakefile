
{spawn, exec} = require "child_process"
fs = require "fs"

echo = (child) ->
  child.stderr.pipe process.stderr
  child.stdout.pipe process.stdout

split = (str) -> str.split " "

queue = [
  "jade -O ./ -wP layout/index.jade"
  "stylus -w layout/"
  "doodle index.html layout/page.css build.js"
]

command = "browserify -d -t coffeeify action/main.coffee"
build = ->
  exec command, (err, stdout, stderr) ->
    console.log "write.. #{stdout[..40]}"
    fs.writeFile "build.js", stdout, "utf8"

stamp = 0
cache = 0

do watch_loop = ->
  unless cache is stamp
    cache = stamp
    build()
  setTimeout watch_loop, 300

task "dev", "watch and convert files", ->
  queue.map(split).forEach (array) ->
    echo (spawn array[0], array[1..])

  list = fs.readdirSync "action/"
  for name in list
    if name.match /\S+\.coffee$/
      fs.watch "action/#{name}", interval: 200, ->
        stamp += 1
  