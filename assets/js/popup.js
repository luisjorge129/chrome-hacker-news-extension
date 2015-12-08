var url = 'https://hacker-news.firebaseio.com/v0/';

angular.module('hackerNewsApp', ['ngResource', 'ngAnimate'])
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
factory('Rest', ['$resource', function($resource)
{
    return $resource('https://hacker-news.firebaseio.com/v0/',
    {},
    {
    list: {
      method: 'GET',
      isArray: true,
      url: url + 'topstories.json'
    },
    get: {
      method: 'GET',
      isArray: false,
      url: url + 'item/:id/.json',
      params: {
                id: '@_id',
              }
    },
  });
}]).
filter('fromNow', function() {
  return function(dateString) {
    if(dateString){
      return moment(dateString*1000).fromNow()
    }else{
      return ""
    }
  };
}).
controller('hackerController', ['$scope', '$http', 'Rest', function($scope, $http, Rest)
{
  $scope.$watch('online', function(newStatus) {
    $scope.refresh = function(){
      $scope.listings = [];
      $scope.list = [];
      $scope.page = 0;
      $scope.initialValue = 0;
      $scope.endValue = 30;
      $scope.moreButton = true;
      Rest.list(function(data) {
        $scope.list = data;
        $scope.news(0);
      });
    };

    $scope.news = function(page){
      $scope.loading = true;

      $scope.initialValue = 30 * page;
      $scope.endValue = 30 * (page + 1);
      for (var i = $scope.initialValue; i < $scope.endValue; i++) {
         Rest.get({id: $scope.list[i]}, function(data){
           $scope.listings.push(data);
         });
      };

      if($scope.endValue >= $scope.list.length){
        $scope.moreButton = false;
      }

      $scope.loading = false;
    };

    $scope.refresh();

  });
}]);
