// Hide everything on the first screen or when logging out
function hideNavigation() {
		$('#header').hide();
		$('#footer').hide();
		$("#back-button").hide();
}

// Show navigations
function showNavigation() {
		$('#header').show();
		$('#footer').show();
		$("#back-button").show();
}


// Make sure we are able to make a post (in case we've already made one)
function allowPost() {
	$('#postMade').hide();
	$('#postBox').show();
	$('#newPost').val('');
}


// Make sure we are able to make a comment (in case we've already made one)
function allowComment() {
	$('#commentMade').hide();
	$('#commentBox').show();
	$('#newComment').val('');
}

// Load the agenda
function loadAgenda() {

	$.ajax({
	url: 'http://amway.650h.co.uk/index/default/getAgenda',
	error: handleAjaxError(), cache: false}).done(function(data) {
		
		// Put content in place on the page
		$("#agendaTitle").html(data.agendaTitle);
		$("#agendaWelcome").html(data.agendaText);
	})
}


// Load hospitality desk
function loadHospitality() {
	
	$.ajax({
	url: 'http://amway.650h.co.uk/index/default/getHospitality',
	error: handleAjaxError(), cache: false}).done(function(data) {
		
		// Build visit text
		var visitText = data.visitText + '<p><center><a href="javascript:window.open(encodeURI(\'https://en.wikipedia.org/wiki/Taj_mahal\'), \'_blank\', \'location=yes\');"><button class="topcoat-button--large" style="background-color: lime">Wikipedia page</button></a></center></p>';
		
		// Build trip advisor text
		var tripadvisorText = data.tripadvisorText + '<p><center><a href="javascript:window.open(encodeURI(\'http://cityguides.tripadvisor.com/\'), \'_blank\', \'location=yes\');"><button class="topcoat-button--large" style="background-color: lime">TripAdvisor New Delhi</button></a></center></p>';
		
		// Put content in place on the page
		$("#introTitle").html(data.introTitle);
		$("#introText").html(data.introText);
		$("#visitTitle").html(data.visitTitle);
		$("#visitText").html(visitText);
		$("#tripadvisorTitle").html(data.tripadvisorTitle);
		$("#tripadvisorText").html(tripadvisorText);
	})
}


// Load workshop list
function loadWorkshopList() {
	
	var userWorkshopList = '';
	var otherWorkshopList = '<ul class="topcoat-list__container">';

	$.ajax({
	url: 'http://amway.650h.co.uk/index/default/getWorkshopsList',
	error: handleAjaxError(), cache: false}).done(function(data) {
		
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
	
	// Show the back button - not working!
	$("#back-button").show();
	
	//var mine = $("#back-button").html();
	//console.log("mine " + mine);
	
	var workshopId = e.view.params.wid;	
	var topicList = resourceList = '';

	$.ajax({
	url: 'http://amway.650h.co.uk/index/default/getWorkshop/' + workshopId,
	error: handleAjaxError(), cache: false}).done(function(data) {
				
		// Topics for this workshop
		if(data.topics.length > 0) {
			$.each(data.topics, function(i,item) {
				topicList = topicList + '<a href="#tabstrip-topic?tid='+item.topicId+'"><li class="topcoat-list__item">' + item.topicTitle + '</li></a>';
			})
		} else {
			topicList = '<li class="topcoat-list__item">There are no topics for this workshop</li>';
        }
		
		// Resources for this workshop
		if(data.resources.length > 0) {
			$.each(data.resources, function(i,item) {
				resourceList = resourceList + '<a href="javascript:window.open(encodeURI(\'' + item.resourcePath +'\'), \'_blank\', \'location=yes\');"><li class="topcoat-list__item">' + item.resourceName + ' (' + item.resourceType + ')</li></a>';
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


// Load the wall - starts with 10 posts, but supports paging
function loadWall() {

	var wallPosts = '';
	var uid = window.localStorage.getItem("userShortId");
	
	$.ajax({
	url: 'http://amway.650h.co.uk/index/default/getWallposts/' + uid + '/0/10',
	error: handleAjaxError(), cache: false}).done(function(data) {
		
		// Build the lists of wall posts
		$.each(data, function(i,item) {
			
			var pid = item.wallpostId,
				ptx = item.postText,
				nck = item.nickname;
			
			wallPosts = wallPosts + '<div class="wallPost">';
			
			if(item.image != '') {
				wallPosts = wallPosts + '<table width="100%"><tr>' +
							'<td><img src="http://amway.650h.co.uk/' + item.image + '" width="100px" /></td>' +
							'<td><p><b>' + nck + ':</b> ' + ptx + '</p></td></tr>';
			} else {
				wallPosts = wallPosts + '<table width="100%"><tr>' +
							'<td colspan="2"><p><strong>' + nck + ':</strong> ' + ptx + '</p></td></tr>';
			}
			
			wallPosts = wallPosts + '<tr><td colspan="2">';
			
			// Like button
			if(item.likedByThisUser) {
				wallPosts = wallPosts + '<span class="likeButton buttonSelected" id="likeButton' + pid + '"><a href="javascript: void(0);">Like</a></span>';
            } else {
				wallPosts = wallPosts + '<span class="likeButton" id="likeButton' + pid + '"><a href="javascript: void(0);" onClick="postLike(' + pid + ',' + uid + ');">Like</a></span>';
			}
			
			// Comment button
			wallPosts = wallPosts + '<span class="commentButton"><a href="#tabstrip-comment" onClick="window.localStorage.setItem(\'pid\', ' + pid + ');">Comment</a></span>';
			
			// Likes & comments count
			wallPosts = wallPosts + '<a href="#tabstrip-viewPost" onClick="window.localStorage.setItem(\'pid\', ' + pid + ');"><span class="likesOrComments">' +
									'<span id="currentLikes' + pid + '">' + item.numberLikes + '</span> Likes ' +
									'<span id="currentComments' + pid + '">' + item.numberComments + ' Comments' +
									'</span></a></td></tr></table></div>';
		});
		
		$("#wallPosts").html(wallPosts);
	});
}

// View a specific wallpost, along with likes and comments
function viewPost() {
	
	// We need the postId, of course!
	var pid = window.localStorage.getItem("pid");

	$.ajax({
	url: 'http://amway.650h.co.uk/index/default/getPost/' + pid,
	error: handleAjaxError(), cache: false}).done(function(data) {
		
		var post = data.post,
			comments = data.comments,
			likes = eval(data.likes),
			originalPost = '',
			likesList = '',
			commentList = '';
		
		var nck = post[0].nickname,
			ptx = post[0].postText,
			img = post[0].image;
			
		
		// Make original post
		if(img != '') {
			originalPost = originalPost + '<table width="100%"><tr>' +
							'<td><img src="http://amway.650h.co.uk/' + img + '" width="100px" /></td>' +
							'<td><p><b>' + nck + ':</b> ' + ptx + '</p></td></tr></table>';
		} else {
			originalPost = originalPost + '<p style="font-weight: bold; color: red">' + nck + ' said:</p>' +
							'<p>' + ptx + '</p>';
		}
		
		$('#originalPost').html(originalPost);
		
		// Make likes list
		if(likes.length > 0) {
			$.each(likes, function(i,like) {
				likesList = likesList + like.nickname + ', ';
			});
			likesList = 'Liked by: ' + likesList.substring(0,likesList.length-2);
		} else {
			likesList = "No likes";
        }
		
		$('#likesList').html(likesList);
		
		// Make comments area
		if(comments.length > 0) {
			$.each(comments, function(i,comment) {
				commentList = commentList + '<div class="op_commentBox">' + comment.nickname + ' replied: ' + comment.commentText + '</div>';
			});
		} else {
			commentsList = "No comments";
        }
		
		$('#commentList').html(commentList);
	});
	
	
}


// Add a like to a post
function postLike(pid, uid) {
	
	$.ajax({
	url: 'http://amway.650h.co.uk/index/default/postLike/' + pid + '/' + uid,
	error: handleAjaxError(), cache: false}).done(function(data) {
		
		// Make sure we target the correct like data
		var replaceDiv = '#currentLikes' + pid;
		var likeButton = '#likeButton' + pid;
		
		// Do it!
		$(replaceDiv).html(data.currentLikes);
		$(likeButton).addClass("buttonSelected");
	});
}



// Load a topic
function loadTopic(e) {
	
	var topicId = e.view.params.tid;
	
	$.ajax({
	url: 'http://amway.650h.co.uk/index/default/getTopic/' + topicId,
	error: handleAjaxError(), cache: false}).done(function(data) {
		
		// Put content in place on the page
		$("#topicTitle").html(data.topicTitle);
		$("#topicDescription").html(data.topicDescription);
	})
}


// Handle error in AJAX
function handleAjaxError() {
	//alert(1);
	//navigator.notification.alert('Sorry, a connection problem occured resulting in your request failing, please try again.');
}
