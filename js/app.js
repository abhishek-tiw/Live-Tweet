var twitterApp = angular.module('twitterApp', []);

twitterApp.filter('reverse', function () {
    return function (items) {
        return items.slice().reverse();
    };
});

twitterApp.controller('mainController', function ($scope, $window) {
    $scope.message = [];
    $scope.CurrentDate = new Date();
    $scope.print = function (msg) {
        $scope.CurrentDate = new Date();
        $scope.message = $scope.message.concat(msg);
    };
});
