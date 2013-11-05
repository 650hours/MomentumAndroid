(function (global) {
    var LoginViewModel,
        app = global.app = global.app || {};

    LoginViewModel = kendo.data.ObservableObject.extend({
        isLoggedIn: false,
        username: "",
		password: "",
		sessionId: "",
        userShortId: "",
		
		// This is nothing to do with login - it handle post submssion to the wall!
		onNewPost: function () {
			
			var that = this,
				newpost = that.get('newpost').trim();
	
			if(newpost === '') {
                navigator.notification.alert('Please enter a post!', function () { }, 'Login failed', 'OK');
                return;
            }
			
			// We need the userId to attribute the post to
			var uid = window.localStorage.getItem("userShortId");
			
			$.ajax({
    			url: 'http://amway.650h.co.uk/index/default/newPost/' + uid + '/' + encodeURI(newpost),
				error: function() {
					$("#resultBlock").html('<h2>Sorry, an error ocurred. Please try again.</h2>');	
                },
				cache: false}).done(function(data) {
					$('#postComment').val('');
                	navigateToWall();
			    });  
		},
		
		// This is nothing to do with login - it handle comment submssion from the wall!
		onPostComment: function () {
			
			var that = this,
				comment = that.get('comment').trim();
			
			if(comment === '') {
                navigator.notification.alert('Please enter a comment!', function () { }, 'Login failed', 'OK');
                return;
            }
			
			// We need the original post and the ID of the user making the comment
			var pid = window.localStorage.getItem("pid");
			var uid = window.localStorage.getItem("userShortId");
			
			$.ajax({
    			url: 'http://amway.650h.co.uk/index/default/postComment/' + pid + '/' + uid + '/' + encodeURI(comment),
				error: function() {
					$("#resultBlock").html('<h2>Sorry, an error ocurred. Please try again.</h2>');	
                },
				cache: false}).done(function(data) {
					
					var newComment = '<div id="commentList" class="op_comments"><div class="op_commentBox">' +
									'<p><span style="font-weight: bold">You</span> replied:</p><p> ' + comment + '</p></div></div>';
					
                	$('#commentMade').html(newComment);
					$('#newComment').val('');
			    });  
		},
		
        onLogin: function () {
			var that = this,
				username = that.get('username').trim(),
				password = that.get('password').trim();

            if (username === '' || password === '') {
                navigator.notification.alert('Both fields are required!', function () { }, 'Login failed', 'OK');
                return;
            }

			$.ajax({
    			url: 'http://amway.650h.co.uk/index/default/login/' + username + '/' + password,
				error: function(){
					$("#resultBlock").html('<h2>Sorry, we could not log you in. Please try again.</h2>');	
                },
				cache: false}).done(function(data) {
					
					if(data.result == 1) {
						that.set('isLoggedIn', true);
						that.set('sessionId', data.sessionId);
						that.set('userShortId', data.userShortId);
						window.localStorage.setItem("userShortId", data.userShortId);

						showNavigation();
						loadAgenda();
						
						// Scroll to the top of the page
						$(".km-scroll-container").css("-webkit-transform", "");
					} else {
						$("#resultBlock").html('<h2>Sorry, we could not log you in. Please try again.</h2>');
                    }
			    });           
        },

        onLogout: function () {
					
            var that = this;
			
            that.clearForm();
            that.set("isLoggedIn", false);
			that.set('sessionId', '');
			
			navigateToHome();
        },

        clearForm: function () {
            var that = this;

            that.set("username", "");
            that.set("password", "");
        }

    });

    app.loginService = {
        viewModel: new LoginViewModel()
    };
	
	// Navigate to home after logging out.
	function navigateToHome() {
		var app = new kendo.mobile.Application();
		app.navigate("#tabstrip-home");
		hideNavigation();
	}
	
	// Navigate to the wall after posting a comment.
	function navigateToWall() {
		var app = new kendo.mobile.Application();
		app.navigate("#tabstrip-wall");
	}
	
})(window);