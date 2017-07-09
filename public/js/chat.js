var chatApp = angular.module('chatApp', ['ngSanitize', 'luegg.directives']);

chatApp.controller('chatCtl', function($scope, $http) {

    $scope.crfocus = false;

	$scope.chat = {
		currMsg: "",
	}

    $scope.user = user;

	$scope.allMessages = [];

    $scope.getMessages = function() {
        $http({
            method: "GET",
            url: '/getMessages',
        }).then(function(res){
            if(res && res.data) {
                $scope.allMessages = res.data;
            }
        }, function(err){
            console.log(err);
        })
    }

    $scope.getMessages();

	$scope.sendMsg = function(e) {
		if(e.keyCode == 13) {
            $('#ajax-popup-bg').show();
            $('#chatMsg').css("pointer-events", "none");
            $http({
                method: "POST",
                url: "getlandmark",
                data: {msg: $scope.chat.currMsg},
            }).then(function(res){
                if(res && res.data) {
                    $scope.allMessages.push(res.data);
                    $('#ajax-popup-bg').fadeOut();
                    $('#chatMsg').css("pointer-events", "auto");
                }
            }, function(err){
                console.log(err);
            })
			$scope.allMessages.push({
				msg: $scope.chat.currMsg,
                image: "",
                user: user._id,
			});
            $scope.chat.currMsg = "";
		}
	}
});