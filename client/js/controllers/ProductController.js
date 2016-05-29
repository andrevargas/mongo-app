app.controller('ProductController', function($scope, $http, $location, $routeParams){
	$scope.formData = {};
	$http.get('/api/product').then(function (response) {
		$scope.products = response.data;
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