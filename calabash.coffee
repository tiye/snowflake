
require("calabash").do 'snow',
  "pkill -f doodle"
  "coffee -o src -wcbm coffee/"
  "doodle src/ index.html"