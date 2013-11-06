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

		// Put content in place on the page
		$("#introTitle").html(data.introTitle);
		$("#introText").html(data.introText);
		$("#visitTitle").html(data.visitTitle);
		$("#visitText").html(data.visitText);
		$("#tripadvisorTitle").html(data.tripadvisorTitle);
		$("#tripadvisorText").html(data.tripadvisorText);
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
				userWorkshopList = userWorkshopList + '<a href="#tabstrip-workshop?wid='+item.workshopId+'"><li class="topcoat-list__item rightNavArrow">' + item.workshopTitle + '</li></a>';
			} else {
				otherWorkshopList = otherWorkshopList + '<a href="#tabstrip-workshop?wid='+item.workshopId+'"><li class="topcoat-list__item rightNavArrow">' + item.workshopTitle + '</li></a>';
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
	
	// Scroll to the top of the page
	$(".km-scroll-container").css("-webkit-transform", "");
	
	var workshopId = e.view.params.wid;	
	var topicList = resourceList = '';

	$.ajax({
	url: 'http://amway.650h.co.uk/index/default/getWorkshop/' + workshopId,
	error: handleAjaxError(), cache: false}).done(function(data) {
				
		// Topics for this workshop
		if(data.topics.length > 0) {
			$.each(data.topics, function(i,item) {
				topicList = topicList + '<a href="#tabstrip-topic?tid='+item.topicId+'"><li class="topcoat-list__item rightNavArrow">' + item.topicTitle + '</li></a>';
			})
		} else {
			topicList = '<li class="topcoat-list__item">There are no topics for this workshop</li>';
        }
		
		// Resources for this workshop
		if(data.resources.length > 0) {
			$.each(data.resources, function(i,item) {
				resourceList = resourceList + '<a onclick="window.open(\'' + item.resourcePath +'\',\'_system\');"><li class="topcoat-list__item rightNavArrow">' + item.resourceName + ' (' + item.resourceType + ')</li></a>';
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


// Load a topic
function loadTopic(e) {
	
	// Scroll to the top of the page
	$(".km-scroll-container").css("-webkit-transform", "");
	
	var topicId = e.view.params.tid;
	
	$.ajax({
	url: 'http://amway.650h.co.uk/index/default/getTopic/' + topicId,
	error: handleAjaxError(), cache: false}).done(function(data) {
		
		// Put content in place on the page
		$("#topicTitle").html(data.topicTitle);
		$("#topicDescription").html(data.topicDescription);
	})
}


// Load the wall - starts with 20 posts, but supports paging
function loadWall() {
	
	// Make sure the navigation is showing
	$('.km-footer').show();

	var wallPosts = '';
	var uid = window.localStorage.getItem("userShortId");
	
	$.ajax({
	url: 'http://amway.650h.co.uk/index/default/getWallposts/' + uid + '/0/20',
	error: handleAjaxError(), cache: false}).done(function(data) {
		
		// Build the lists of wall posts
		$.each(data, function(i,item) {
			
			var pid = item.wallpostId,
				ptx = item.postText,
				nck = item.nickname;
			
			wallPosts = wallPosts + '<a href="#tabstrip-viewPost" onClick="window.localStorage.setItem(\'pid\', ' + pid + ');">' +
									'<div class="wallPost wallPostOnWall rightNavArrow">';
			
			if(item.image != '') {
				wallPosts = wallPosts + '<table width="100%"><tr>' +
							'<td width="100"><img src="http://amway.650h.co.uk/' + item.image + '" width="100px" /></td>' +
							'<td><p><b>' + nck + ':</b> ' + ptx + '</p></td></tr>';
			} else {
				wallPosts = wallPosts + '<table width="100%"><tr>' +
							'<td colspan="2"><p><strong>' + nck + ':</strong> ' + ptx + '</p></td></tr>';
			}
			
			wallPosts = wallPosts + '<tr><td colspan="2"><p class="likesComments">';
			
			// Like button
			
			// 1 like, 2 likes
			var likeText = ' likes';
			if(item.numberLikes == 1) {
				likeText = ' like';
			}
			
			if(item.likedByThisUser) {
				wallPosts = wallPosts + '<span class="likeButton buttonSelected" id="likeButton'+pid+'">' +
										'<a href="javascript: void(0);" onClick="postUnlike('+pid+','+uid+');"><span id="currentLikes'+pid+'">'+item.numberLikes+likeText+'</span></a></span>';
            } else {
				wallPosts = wallPosts + '<span class="likeButton" id="likeButton'+pid+'">' +
										'<a href="javascript: void(0);" onClick="postLike('+pid+','+uid+');"><span id="currentLikes'+pid+'">'+item.numberLikes+likeText+'</span></a></span>';
			}
			
			// Comment button
			
			// 1 comment, 2 comments
			// Button selected?
			
			var commentText = ' comments',
				buttonSelected = '';
			
			if(item.numberComments > 0) {
				buttonSelected = " buttonSelected";
				if(item.numberComments == 1) {
					commentText = ' comment';
				}
			}
			
			wallPosts = wallPosts + '<span class="commentButton'+buttonSelected+'"><a href="javascript: void(0);">'+item.numberComments+commentText+'</a></span>';
			
			// Likes & comments count
			wallPosts = wallPosts + '</p></td></tr></table></div></a>';
		});
		
		$("#wallPosts").html(wallPosts);
	});
}

// View a specific wallpost, along with likes and comments
function viewPost() {
	
	// Make sure the navigation is hidden
	$('.km-footer').hide();
	
	// Scroll to the top of the page
	$(".km-scroll-container").css("-webkit-transform", "");
	
	// We need the postId, of course!
	var pid = window.localStorage.getItem("pid");
	
	// And we need the user id to see if they made any posts
	var uid = window.localStorage.getItem("userShortId");
	
	// Clear out the commentMade box, otherwise comments look duplicated
	$('#commentMade').html('');

	$.ajax({
	url: 'http://amway.650h.co.uk/index/default/getPost/' + pid,
	error: handleAjaxError(), cache: false}).done(function(data) {
		
		var post = data.post,
			comments = data.comments,
			likes = eval(data.likes),
			originalPost = '',
			likesList = '',
			commentList = '',
			nickname = '';
		
		var nck = post[0].nickname,
			ptx = post[0].postText,
			img = post[0].image;
			
		// Make likes list
		if(likes.length > 0) {
			$.each(likes, function(i,like) {			
				if(like.userShortId == uid) {
					nickname = 'You';
                } else {
					nickname = like.nickname;
                }
				likesList = likesList + nickname + ', ';
			});
			likesList = 'Liked by: ' + likesList.substring(0,likesList.length-2);
		} else {
			likesList = "No likes";
        }
		
		// Make original post
		if(img != '') {
			originalPost = originalPost + '<div class="wallPost"><table width="100%"><tr>' +
							'<td><img src="http://amway.650h.co.uk/' + img + '" width="100px" /></td>' +
							'<td><p><b>' + nck + ':</b> ' + ptx + '</p></td></tr></table><p>'+likesList+'</p></div>';
		} else {
			originalPost = originalPost + '<div class="wallPost"><p style="font-weight: bold">' + nck + ' said:</p>' +
							'<p>' + ptx + '</p><p style="font-size: 0.8em">'+likesList+'</p></div>';
		}
		
		$('#originalPost').html(originalPost);
		
		// Make comments area
		if(comments.length > 0) {
			$.each(comments, function(i,comment) {
				if(comment.userShortId == uid) {
					nickname = 'You';
                } else {
					nickname = comment.nickname;
                }
				commentList = commentList + '<div class="op_commentBox">' +
											'<p><span style="font-weight: bold">' + nickname + '</span> replied:</p><p> ' + comment.commentText + '</p></div>';
			});
		} else {
			commentsList = "No comments";
        }
		
		$('#commentList').html(commentList);
	});
}


// Add a new post
function addPost() {
	// Make sure the navigation is hidden
	$('.km-footer').hide();
	
	// Clear and focus the textarea
	$('#newPost').val('');
	$('#newPost').focus();
}


// Add a like to a post
function postLike(pid, uid) {
	
	$.ajax({
	url: 'http://amway.650h.co.uk/index/default/postLike/' + pid + '/' + uid,
	error: handleAjaxError(), cache: false}).done(function(data) {
		
		// Make sure we target the correct like data
		var replaceDiv = '#currentLikes' + pid;
		var likeButton = '#likeButton' + pid;
		
		var likeText = data.currentLikes;
		
		if(data.currentLikes == 1) {
			likeText = likeText + ' like';
        } else {
			likeText = likeText + ' likes';
        }
		
		// Do it!
		$(replaceDiv).html(likeText);
		$(likeButton).addClass("buttonSelected");
	});
}


// Remove a like from a post
function postUnlike(pid, uid) {
	
	$.ajax({
	url: 'http://amway.650h.co.uk/index/default/postUnlike/' + pid + '/' + uid,
	error: handleAjaxError(), cache: false}).done(function(data) {
		
		// Make sure we target the correct like data
		var replaceDiv = '#currentLikes' + pid;
		var likeButton = '#likeButton' + pid;
		
		var likeText = data.currentLikes;

		if(data.currentLikes == 1) {
			likeText = likeText + ' like';
        } else {
			likeText = likeText + ' likes';
        }
		
		// Do it!
		$(replaceDiv).html(likeText);
		$(likeButton).removeClass("buttonSelected");
	});
}

// Handle error in AJAX
function handleAjaxError() {
	//alert(1);
	//navigator.notification.alert('Sorry, a connection problem occured resulting in your request failing, please try again.');
}
