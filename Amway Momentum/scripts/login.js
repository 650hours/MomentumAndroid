(function (global) {
    var LoginViewModel,
        app = global.app = global.app || {};

    LoginViewModel = kendo.data.ObservableObject.extend({
        isLoggedIn: false,
        username: "",
		password: "",
		sessionId: "",
        userShortId: "",
		
        onLogin: function () {
			var that = this,
				username = that.get('username').trim(),
				password = that.get('password').trim();

            if (username === '' || password === '') {
                navigator.notification.alert('Both fields are required!', function () { }, 'Login failed', 'OK');
                return;
            }

			$.ajax({
    			url: 'http://amway.650h.co.uk/index/default/login',
				error: function(){
					$("#resultBlock").html('<h2>Sorry, we could not log you in. Please try again.</h2>');	
                },
				cache: false}).done(function(data) {
					
					if(data.result == 1) {
						that.set('isLoggedIn', true);
						that.set('sessionId', data.sessionId);
						that.set('userShortId', data.userShortId);
						$('#footerNavigation').show();
						loadAgenda();
					} else {
						$("#resultBlock").html('<h2>Sorry, we could not log you in. Please try again.</h2>');
                    }
			    });           
        },

        onLogout: function () {
            var that = this;

            that.clearForm();
			$('#footerNavigation').hide();
            that.set("isLoggedIn", false);
			that.set('sessionId', '');
			alert(1);
			
			app.navigate("#tabstrip-home");
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
})(window);