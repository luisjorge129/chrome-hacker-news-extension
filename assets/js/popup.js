var url = 'https://hacker-news.firebaseio.com/v0/';

angular.module('hackerNewsApp', ['ngResource', 'ngAnimate'])
.config(function($httpProvider) {
  $httpProvider.defaults.xsrfCookieName = 'csrftoken';
  $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
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
  $scope.refresh = function(){
    $scope.listings = [];
    $scope.list = [];
    $scope.page = 0;
    $scope.initialValue = 0;
    $scope.endValue = 30;
    $scope.list = Rest.list();
    $scope.news(0);
  };

  $scope.news = function(page){
    setTimeout(function() {
        $scope.loading = false;

        var templist = [];

        $scope.initialValue = 30 * page;
        $scope.endValue = 30 * (page + 1);
        for (var i = $scope.initialValue; i < $scope.endValue; i++) {
           templist.push(Rest.get({id: $scope.list[i]}))
        }
        $scope.listings = $scope.listings.concat(templist);

    }, 1000);

    // $scope.page += 1;
    $scope.loading = !$scope.loading;
  };

  $scope.refresh();
}]);
