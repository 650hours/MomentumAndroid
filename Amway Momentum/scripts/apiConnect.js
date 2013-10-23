// Load the agenda
function loadAgenda() {
	
	$.ajax({
	url: 'http://amway.650h.co.uk/index/default/getAgenda',
	error: function() {
		$("#resultBlock").html('Sorry, a connection problem occured, please try again.');	
    },
	cache: false}).done(function(data) {
		
		// Put content in place on the page
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
		
		// Put content in place on the page
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
		
		// Build the lists of user attended workshops and other workshops
		$.each(data, function(i,item) {
			if(item.userIsAttending == 1) {
				userWorkshopList = userWorkshopList + '<a href="#tabstrip-workshop?wid='+item.workshopId+'"><li class="topcoat-list__item">' + item.workshopTitle + '</li></a>';
			} else {
				otherWorkshopList = otherWorkshopList + '<a href="#tabstrip-workshop?wid='+item.workshopId+'"><li class="topcoat-list__item">' + item.workshopTitle + '</li></a>';
            }
		})
		
		otherWorkshopList = otherWorkshopList + '</ul>';
		
		// Put content in place on the page
		$("#userWorkshopList").html(userWorkshopList);
		$("#otherWorkshopList").html(otherWorkshopList);
	});
}


// Load an individual workshop
function loadWorkshop(e) {
	
	var workshopId = e.view.params.wid;	
	var topicList = resourceList = '';

	$.ajax({
	url: 'http://amway.650h.co.uk/index/default/getWorkshop/' + workshopId,
	error: function() {
		$("#resultBlock").html('Sorry, a connection problem occured, please try again.');	
    },
	cache: false}).done(function(data) {
				
		// Topics for this workshop
		if(data.topics.length > 0) {
			$.each(data.topics, function(i,item) {
				topicList = topicList + '<a href="#tabstrip-topic?wid='+item.topicId+'"><li class="topcoat-list__item">' + item.topicTitle + '</li></a>';
			})
		} else {
			topicList = '<li class="topcoat-list__item">There are no topics for this workshop</li>';
        }
		
		// Resources for this workshop
		if(data.resources.length > 0) {
			$.each(data.resources, function(i,item) {
				resourceList = resourceList + '<a href="#tabstrip-topic?wid='+item.resourceId+'"><li class="topcoat-list__item">' + item.resourceName + '</li></a>';
			})
		} else {
			resourceList = '<li class="topcoat-list__item">There are no resources for this workshop</li>';
        }
		
		// Put content in place on the page
		$("#workshopTitle").html('About ' + data.workshopTitle);
		$("#workshopDescription").html(data.workshopDescription);
		$("#topicList").html(topicList);
		$("#resourceList").html(resourceList);
	});
}




