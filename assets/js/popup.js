var url = 'https://hacker-news.firebaseio.com/v0/';

angular.module('hackerNewsApp', ['ngResource'])
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
    return moment(dateString).fromNow()
  };
}).
controller('hackerController', ['$scope', '$http', 'Rest', function($scope, $http, Rest)
{
  $scope.refreshLoading = false;
  $scope.list = [];
  $scope.listings = [];
  $scope.page = 0;
  $scope.initialValue = 0;
  $scope.endValue = 30;
  $scope.list = Rest.list();

  $scope.news = function(page){
    setTimeout(function() {
      $scope.$apply(function() {
        $scope.loading = false;

        $scope.initialValue = 30 * page;
        $scope.endValue = 30 * (page + 1);

        for (var i = $scope.initialValue; i < $scope.endValue; i++) {
           $scope.listings.push(Rest.get({id: $scope.list[i]}));
        }

      });
    }, 1000);

    // $scope.page += 1;
    $scope.loading = !$scope.loading;
  };

  $scope.refresh = function(){
    $scope.refreshLoading = false;
    $scope.listings = [];
    $scope.page = 0;
    $scope.initialValue = 0;
    $scope.endValue = 30;
    $scope.list = Rest.list();
    $scope.news(0);
    $scope.refreshLoading = true;
  };

  $scope.news(0);
  $scope.refreshLoading = true;
}]);
