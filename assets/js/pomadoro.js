$(function(){

	$.getJSON('assets/default.json', function(data) {
		for(var i in data) {
			$('input[name="'+ i +'"]').val(data[i]);
		}
		$("#current-time").text('0:00');
		$("#current-session").text('None');
	});

  $('#start').on('click', function(e){
    e.preventDefault();
    console.log("Beginning timer");
  });

  $("pause").on('click', function(e){
  	e.preventDefault();
  });

    $("reset").on('click', function(e){
  	e.preventDefault();
  	for(var i in data) {
			$('input[name="'+ i +'"]').val(data[i]);
		}
  });
});
