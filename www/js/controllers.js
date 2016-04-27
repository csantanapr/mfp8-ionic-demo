/// <reference path="plugins/cordova-plugin-mfp-push/typings/mfppush.d.ts"/>
angular.module('starter.controllers', [])

  .controller('MfpCtrl', function($scope, MFPInit) {


    MFPInit.then(function() {
      WL.App.getServerUrl(function(url) {
        $scope.serverurl = url;
      });
      if(typeof MFPPush !== 'undefined'){
        MFPPush.initialize(
          function(successResponse) {
            WL.Logger.debug("Successfully intialized");
            MFPPush.registerNotificationsCallback(notificationReceived);
        }, function(failureResponse) {
            alert("Failed to initialize");
        });
      }
        
    });

    function getPic() {
      var image = navigator.camera.getPicture(onPic, null,
        {
          quality: 25,
          destinationType: Camera.DestinationType.DATA_URL,
          sourceType: Camera.PictureSourceType.PHOTOLIBRARY
        });
    }

    function onPic(imageData) {
      var image = document.getElementById('myImage');
      image.src = imageData.indexOf('data:image') === 0 ? imageData : "data:image/jpeg;base64," + imageData
    }



    function greetAdapter() {
      var resourceRequest = new WLResourceRequest(
        "/adapters/javaAdapter/resource/greet",
        WLResourceRequest.GET
      );
      resourceRequest.setQueryParameter("name", "Carlos");

      resourceRequest.send().then(
        function(response) {
          WL.Logger.debug("Adapter response: " + response.responseText);
          document.getElementById("resultGreet").innerHTML = "Adapter said: " + response.responseText;
        },
        function(response) {
          WL.Logger.debug("Failed to call adapter: " + JSON.stringify(response));
          document.getElementById("resultGreet").innerHTML = "Failed to call adapter.";
        });
    }
    
    function postSlack() {
      var resourceRequest = new WLResourceRequest(
        "/adapters/slack//postSlack",
        WLResourceRequest.GET
      );
      resourceRequest.setQueryParameter("params", "['Hello From Ionic MFP']");

      resourceRequest.send().then(
        function(response) {
          WL.Logger.debug("Adapter response: " + response.responseText);
          //document.getElementById("postSlack").innerHTML = "Adapter said: " + response.responseText;
        },
        function(response) {
          WL.Logger.debug("Failed to call adapter: " + JSON.stringify(response));
          //document.getElementById("postSlack").innerHTML = "Failed to call adapter.";
        });
    }

    function getBalance() {
      var resourceRequest = new WLResourceRequest("/adapters/ResourceAdapter/balance",
        WLResourceRequest.GET);

      resourceRequest.send().then(
        function(response) {
          WL.Logger.debug("Balance: " + response.responseText);
          document.getElementById("resultBalance").innerHTML = "Balance: " + response.responseText;
        },
        function(response) {
          WL.Logger.debug("Failed to get balance: " + JSON.stringify(response));
          document.getElementById("resultBalance").innerHTML = "Failed to get balance.";
        });
    }

    $scope.$on('$ionicView.enter', function() {
      MFPInit.then(function() { WL.Analytics.log({ AppView: 'MFPF' }, "visit mfpf view"); console.log("mfpf view enter") });
    });

    function sendAnalytics() {
      console.log("Sending analytics");
      WL.Analytics.send().then(function() {
        alert("analytics logs sent");
      });

    }
    
    function isPushSupported() {
      MFPPush.isPushSupported (function (answer){
        $scope.$apply(function () {
            $scope.pushSupported = answer;
        });
      });
    }

    function registerDevice() {
      MFPPush.registerDevice(function(){
        $scope.$apply(function () {
            $scope.registerDevice = "Yay!";
        });
      });
      
    }
    function getSubscriptions(){
      MFPPush.getSubscriptions(
        function(subscriptions) {
            $scope.$apply(function () {
            $scope.subscriptions = subscriptions;
        });
         }
      );
    }
    
    function notificationReceived(message){
      $scope.$apply(function () {
            message.payload = JSON.parse(message.payload);
            $scope.message = message;
            if(message.alert && message.alert.body){
              alert(message.alert.body);
            } else if (message.alert){
              alert(message.alert);
            }
        });
    }


    $scope.getPic = getPic;
    $scope.greetAdapter = greetAdapter;
    $scope.getBalance = getBalance;
    $scope.sendAnalytics = sendAnalytics;
    $scope.isPushSupported = isPushSupported;
    $scope.registerDevice = registerDevice;
    $scope.getSubscriptions = getSubscriptions;
    $scope.postSlack = postSlack;
  })



  .run(function($rootScope, $ionicModal, $timeout, MFPInit) {

    //MobileFirst Authentication setup
    var securityCheckName = 'UserLogin';

    MFPInit.then(function() {
      LoginChallenge = new WL.Client.createWLChallengeHandler(securityCheckName);

      LoginChallenge.securityCheckName = securityCheckName;

      LoginChallenge.handleChallenge = function(response) {
        $rootScope.login();
      };

      LoginChallenge.processSuccess = function(data) {
        WL.Logger.debug("processSuccess");
        console.log("LoginChallenge.processSuccess");
      };

      LoginChallenge.handleFailure = function(error) {
        console.log("LoginChallenge.handleFailure");
      };


      $rootScope.doLogin = function() {
        console.log('Submitting LoginData', $rootScope.loginData.username);
        $rootScope.closeLogin();
        /*
        $timeout(function() {
          LoginChallenge.submitChallengeAnswer({
            'username': $rootScope.loginData.username,
            'password': $rootScope.loginData.password
          });
        }, 3000, false, [Pass]);
        */
        LoginChallenge.submitChallengeAnswer({
          'username': $rootScope.loginData.username,
          'password': $rootScope.loginData.password
        });

      };




      $rootScope.doLogout = function() {
        WLAuthorizationManager.logout(securityCheckName).then(
          function() {
            WL.Logger.debug("logout onSuccess");
            location.reload();
          },
          function(response) {
            WL.Logger.debug("logout onFailure: " + JSON.stringify(response));
          });
      }




    });


    $rootScope.loginData = {};
    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
      scope: $rootScope
    }).then(function(modal) {
      $rootScope.modal = modal;
    });

    // Triggered in the login modal to close it
    $rootScope.closeLogin = function() {
      $rootScope.modal.hide();
    };

    // Open the login modal
    $rootScope.login = function() {
      $rootScope.modal.show();
    };

  })














































  .controller('DashCtrl', function($scope, MFPInit) {
    $scope.$on('$ionicView.enter', function() {
      MFPInit.then(function() { WL.Analytics.log({ AppView: 'Status' }, "visit status view"); console.log("status view enter") });
    });
  })

  .controller('ChatsCtrl', function($scope, Chats, MFPInit) {
    $scope.$on('$ionicView.enter', function() {
      MFPInit.then(function() { WL.Analytics.log({ AppView: 'Chat' }, "visit chat view"); console.log("chat view enter") });
    });

    $scope.chats = Chats.all();
    $scope.remove = function(chat) {
      Chats.remove(chat);
    };
  })

  .controller('ChatDetailCtrl', function($scope, $stateParams, Chats, MFPInit) {
    $scope.$on('$ionicView.enter', function() {
      MFPInit.then(function() { WL.Analytics.log({ AppView: 'Chat Details' }, "visit Chat Details view"); console.log("chat details view enter") });
    });
    $scope.chat = Chats.get($stateParams.chatId);
  })

  .controller('AccountCtrl', function($scope, MFPInit) {
    $scope.$on('$ionicView.enter', function() {
      MFPInit.then(function() { WL.Analytics.log({ AppView: 'Account' }, "visit Account view"); console.log("account view enter") });
    });
    $scope.settings = {
      enableFriends: true
    };
  });
