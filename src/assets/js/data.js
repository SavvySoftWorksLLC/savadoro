function timeRemaining(){
  var updatedTime = $('#current-time').text()
  return updatedTime
}

function transmit() {
  console.log(timeRemaining())
}

var refreshId = setInterval(transmit, 3000);
