var app = angular.module('mongo-app', ['ngRoute']);

app.config(function($routeProvider, $locationProvider) {

	$locationProvider.html5Mode(true);

	$routeProvider
	.when('/product', {
         templateUrl: '../views/products.html',
         controller: 'ProductController'
   	})
   	.when('/product/new', {
         templateUrl: '../views/addProduct.html',
         controller: 'ProductController'
   	})
   	.when('/product/:id/maintence/new', {
         templateUrl: '../views/addMaintence.html',
         controller: 'ProductController'
   	})
      .when('/category', {
         templateUrl: '../views/categories.html',
         controller: 'CategoryController'
      })
      .when('/category/new', {
         templateUrl: '../views/addCategory.html',
         controller: 'CategoryController'
      })
	.otherwise ({ redirectTo: '/product' });

});

app.factory('categories', function($http){
   return $http.get('/api/category');
});
