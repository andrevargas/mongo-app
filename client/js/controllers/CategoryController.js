app.controller('CategoryController', function($scope, $http, $location, categories){
    $scope.formData = {};
    categories.get().then(function (response) {
        $scope.categories = response.data;
    });
    $scope.createCategory = function(){
        $http.post('/api/category/new', $scope.formData)
        .success(function(data){
            $scope.formData = {};
            $scope.categories = data;
            $location.path('/category');
        });
    };
});
