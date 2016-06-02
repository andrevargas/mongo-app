app.controller('ProductController', function($scope, $http, $location, $routeParams, categories){
	$scope.formData = {};
	$http.get('/api/product').then(function (response) {
		$scope.products = response.data;
	});
	categories.then(function (response) {
        $scope.categories = response.data;
        $scope.formData.category = $scope.categories[0];
    });
	$scope.createProduct = function(){
		$http.post('/api/product/new', $scope.formData)
		.success(function(){
			$scope.formData = {};
			$location.path('/product');
		});
	};
	$scope.addMaintence = function(){
		$http.put('/api/product/'+ $routeParams.id +'/maintence/new', $scope.formData)
		.success(function(){
			$scope.formData = {};
			$location.path('/product');
		});
	}
});
