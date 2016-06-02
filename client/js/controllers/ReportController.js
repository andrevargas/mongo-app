app.controller('ReportController', function($scope, $http){
    $scope.report = {};
    $http.get('/api/report').then(function(response){
        $scope.report.data = response.data
    });
});
