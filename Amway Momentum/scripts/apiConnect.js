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