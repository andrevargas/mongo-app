var app = angular.module('mongo-app', ['ngRoute']);

app.config(function($routeProvider, $locationProvider) {

	$locationProvider.html5Mode(true);

	$routeProvider
	.when('/equipment', {
         templateUrl: '../views/equipments.html',
         controller: 'EquipmentController'
   	})
   	.when('/equipment/new', {
         templateUrl: '../views/addEquipment.html',
         controller: 'EquipmentController'
   	})
   	.when('/equipment/:id/maintenance/new', {
         templateUrl: '../views/addMaintenance.html',
         controller: 'EquipmentController'
   	})
      .when('/category', {
         templateUrl: '../views/categories.html',
         controller: 'CategoryController'
      })
      .when('/category/new', {
         templateUrl: '../views/addCategory.html',
         controller: 'CategoryController'
      })
      .when('/report', {
         templateUrl: '../views/reports.html',
         controller: 'ReportController'
      })
	.otherwise ({ redirectTo: '/equipment' });

});

app.factory('categories', function($http){

   var categories = {};

   categories.get = function(){
      return $http.get('/api/category');
   }

   return categories;

});
