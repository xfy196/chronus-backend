const process = require("child_process")

const cmd = 'npm i && npm run start'
process.exec(cmd, function(error, stdout, stderr){
    console.log("error" + error)
    console.log("stdout" + stdout)
    console.log("stderr" + stderr)
})