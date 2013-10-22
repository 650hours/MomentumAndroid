// Load the agenda
function loadAgenda() {
	
	$.ajax({
	url: 'http://amway.650h.co.uk/index/default/getAgenda',
	error: function() {
		$("#resultBlock").html('Sorry, a connection problem occured, please try again.');	
    },
	cache: false}).done(function(data) {
		$("#agendaTitle").html('<h1>' + data.agendaTitle + '</h1>');
		$("#agendaWelcome").html(data.agendaText);
	})
}

// Load hospitality desk
function loadHospitality() {
	
	$.ajax({
	url: 'http://amway.650h.co.uk/index/default/getHospitality',
	error: function() {
		$("#resultBlock").html('Sorry, a connection problem occured, please try again.');	
    },
	cache: false}).done(function(data) {
		
		// Build visit text
		var visitText = data.visitText + '<p><center><a href="javascript:window.open(encodeURI(\'https://en.wikipedia.org/wiki/Taj_mahal\'), \'_blank\', \'location=yes\');"><button class="topcoat-button--large" style="background-color: lime">Wikipedia page</button></a></center></p>';
		
		// Build trip advisor text
		var tripadvisorText = data.tripadvisorText + '<p><center><a href="javascript:window.open(encodeURI(\'http://cityguides.tripadvisor.com/\'), \'_blank\', \'location=yes\');"><button class="topcoat-button--large" style="background-color: lime">TripAdvisor New Delhi</button></a></center></p>';
		
		$("#introTitle").html('<h1>' + data.introTitle + '</h1>');
		$("#introText").html(data.introText);
		$("#visitTitle").html('<h1>' + data.visitTitle + '</h1>');
		$("#visitText").html(visitText);
		$("#tripadvisorTitle").html('<h1>' + data.tripadvisorTitle + '</h1>');
		$("#tripadvisorText").html(tripadvisorText);
	})
}

// Load workshop list
function loadWorkshopList() {
	
	var userWorkshopList = '';
	var otherWorkshopList = '<ul class="topcoat-list__container">';

	$.ajax({
	url: 'http://amway.650h.co.uk/index/default/getWorkshopsList',
	error: function() {
		$("#resultBlock").html('Sorry, a connection problem occured, please try again.');	
    },
	cache: false}).done(function(data) {
		
		$.each(data, function(i,item) {
			if(item.userIsAttending == 1) {
				userWorkshopList = userWorkshopList + '<a href="#tabstrip-workshop?wid='+item.workshopId+'"><li class="topcoat-list__item">' + item.workshopTitle + '</li></a>';
			} else {
				otherWorkshopList = otherWorkshopList + '<li class="topcoat-list__item">' + item.workshopTitle + '</li>';
            }
		})
		
		otherWorkshopList = otherWorkshopList + '</ul>';
		
		$("#userWorkshopList").html(userWorkshopList);
		$("#otherWorkshopList").html(otherWorkshopList);
	});
}


// Load an individual workshop
function loadWorkshop(e) {
	
	var workshopId = e.view.params.wid;
	alert(workshopId);
}