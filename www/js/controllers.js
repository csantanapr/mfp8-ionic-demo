angular.module('starter.controllers', [])

.controller('MfpCtrl', function($scope, MFPInit) {
  
  function getPic(){
    var image = navigator.camera.getPicture(onPic, null, 
    { 
      quality: 25,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.PHOTOLIBRARY
    });
  }
  
  function onPic(imageData){
    var image = document.getElementById('myImage');
    image.src = imageData.indexOf('data:image') === 0 ? imageData : "data:image/jpeg;base64," + imageData
  }
  
  function sendAnalytics(){
    console.log("Sending analytics");
    WL.Analytics.send().then(function(){
      alert("analytics logs sent");
    });

  }
  

  $scope.getPic = getPic;
  $scope.sendAnalytics = sendAnalytics;
})


















































.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
