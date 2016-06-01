app.controller('CategoryController', function($scope, $http, $location){
    $scope.formData = {};
    $http.get('/api/category').then(function (response) {
        $scope.categories = response.data;
    });
    $scope.createCategory = function(){
        $http.post('/api/category/new', $scope.formData)
        .success(function(){
            $scope.formData = {};
            $location.path('/category');
        });
    };
});
