var url = 'https://hacker-news.firebaseio.com/v0/';

angular.module('hackerNewsApp', ['ngAnimate'])
.config(function($httpProvider) {
  $httpProvider.defaults.xsrfCookieName = 'csrftoken';
  $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
}).
run(function($window, $rootScope) {
      $rootScope.online = navigator.onLine;
      $window.addEventListener("offline", function () {
        $rootScope.$apply(function() {
          $rootScope.online = false;
        });
      }, false);
      $window.addEventListener("online", function () {
        $rootScope.$apply(function() {
          $rootScope.online = true;
        });
      }, false);
}).
filter('fromNow', function() {
  return function(dateString) {
    if(dateString){
      return moment(dateString*1000).fromNow()
    }else{
      return ""
    }
  };
}).
controller('hackerController', ['$scope', '$http', function($scope, $http)
{
  $scope.$watch('online', function(newStatus) {
    $scope.setLoading = function(loading) {
      $scope.isLoading = loading;
      $scope.isDisabled = loading;
    }

    $scope.refresh = function(){
      $scope.setLoading(true);
      $scope.listings = [];
      $scope.list = [];
      $scope.page = 0;
      $scope.initialValue = 0;
      $scope.endValue = 30;
      $scope.moreButton = true;
      $http.get(url + "topstories.json").then(function(response) {
        $scope.list = response.data;
        $scope.news(0);
      });
    };

    $scope.news = function(page){
      $scope.setLoading(true);
      $scope.initialValue = 30 * page;
      $scope.endValue = 30 * (page + 1);

      if ($scope.endValue >= $scope.list.length - 1){
        $scope.endValue = $scope.list.length - 1;
        $scope.moreButton = false;
      }

      for (var i = $scope.initialValue; i < $scope.endValue; i++) {
        $http.get(url + 'item/' + $scope.list[i] + '/.json').then(function(response) {
          $scope.listings.push(response.data);
        });
      };

      $scope.setLoading(false);
    };

    $scope.refresh();
  });
}]);
