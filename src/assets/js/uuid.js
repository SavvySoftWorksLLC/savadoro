const storage = require('electron-json-storage')
const fs = require('fs')
const uuidv4 = require('uuid/v4')
const dataPath = storage.getDataPath()

var savaUUID

// node file system does exist?
// process path, its an absolute path

if (fs.existsSync(dataPath + '/token.json')) {
  var store = storage.getAll(function(error, data) {
    if (error) throw error

    savaUUID = data.token.uuid
    setToken()
  })
} else {
  savaUUID = uuidv4()
  console.log(savaUUID)

  storage.set('token', { uuid: savaUUID }, function(error) {
    if (error) throw error

    setToken()
  })
}

function setToken(){
  $('#savadoro-id').html(savaUUID)
}
