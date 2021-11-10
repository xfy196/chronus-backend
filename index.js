const process = require("child_process")

const cmd = 'egg-scripts start --daemon --title=egg-server-chronus-backend'
process.exec(cmd, function(error, stdout, stderr){
    console.log("error" + error)
    console.log("stdout" + stdout)
    console.log("stderr" + stderr)
})