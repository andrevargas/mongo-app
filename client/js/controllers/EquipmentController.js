app.controller('EquipmentController', function($scope, $http, $location, $routeParams, categories){
	$scope.formData = {};
	$http.get('/api/equipment').then(function (response) {
		$scope.equipments = response.data;
	});
	categories.get().then(function (response) {
        $scope.categories = response.data;
        $scope.formData.category = $scope.categories[0];
    });
	$scope.createEquipment = function(){
		$http.post('/api/equipment/new', $scope.formData)
		.success(function(){
			$scope.formData = {};
			$location.path('/equipment');
		});
	};
	$scope.addMaintenance = function(){
		$http.put('/api/equipment/'+ $routeParams.id +'/maintenance/new', $scope.formData)
		.success(function(){
			$scope.formData = {};
			$location.path('/equipment');
		});
	}
	$scope.$on('$viewContentLoaded', function() {
		if($routeParams.id) {
			$http.get('/api/equipment/' + $routeParams.id).then(function(response){
				$scope.selectedEquipment = response.data
			});
		}
	});
});
