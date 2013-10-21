
// Load workshop list
function loadWorkShopList() {
	
	var userWorkshopList = '';
	var otherWorkshopList = '';

	$.ajax({
	url: 'http://amway.650h.co.uk/index/default/getWorkshopsList',
	error: function(){
		$("#resultBlock").html('Sorry, we were unable to log you in, please try again.');	
    },
	cache: false}).done(function(data) {
		alert('done');
		$.each(data, function(i,item) {
			if(item.userIsAttending == 1) {
				userWorkshopList = userWorkshopList + '<h2>' + item.workshopTitle + '<h2>';
			} else {
				otherWorkshopList = otherWorkshopList + '<h2>' + item.workshopTitle + '<h2>';
            }
		})
		alert(userWorkshopList);
		alert(otherWorkshopList);
		$("#userWorkshopList").html(userWorkshopList);
		$("#otherWorkshopList").html(otherWorkshopList);
	});
}