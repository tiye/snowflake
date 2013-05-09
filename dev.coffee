
require("calabash").do 'snow',
  "pkill -f doodle"
  "jade --out ./build/ -wP layout/index.jade"
  "stylus -o build/ -w layout/"
  "cjsify -o build/build.js -w coffee/main.coffee -s build/build.map"
  "doodle build build.js"